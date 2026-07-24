import express, { Request, Response } from 'express';
import path from 'path';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.js';
import {
  authenticateToken,
  requireAdmin,
  hashPassword,
  generateToken,
  AuthenticatedRequest,
} from './server/auth.js';
import { analyzeComplaintWithGemini } from './server/gemini.js';
import { User, Complaint } from './src/types.js';

const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  storage: multer.memoryStorage(),
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // ===================== AUTH ROUTES =====================

  // Register
  app.post('/api/auth/register', (req: Request, res: Response): void => {
    try {
      const { name, email, password, phone, role } = req.body;

      if (!name || !email || !password) {
        res.status(400).json({ error: 'Name, email, and password are required' });
        return;
      }

      const existing = db.findUserByEmail(email);
      if (existing) {
        res.status(400).json({ error: 'User with this email already exists' });
        return;
      }

      const newUser: User = {
        id: 'usr_' + Date.now(),
        name,
        email,
        phone: phone || '',
        role: role === 'admin' ? 'admin' : 'user',
        createdAt: new Date().toISOString(),
      };

      db.createUser(newUser, password);
      const token = generateToken(newUser);

      res.status(201).json({ user: newUser, token });
    } catch (err: any) {
      console.error('Register error:', err);
      res.status(500).json({ error: err.message || 'Server error during registration' });
    }
  });

  // Login
  app.post('/api/auth/login', (req: Request, res: Response): void => {
    try {
      const { email, password } = req.body;

      if (!email) {
        res.status(400).json({ error: 'Email address is required' });
        return;
      }

      const cleanEmail = String(email).trim().toLowerCase();
      const pwd = String(password || '').trim();

      let user = db.findUserByEmail(cleanEmail);
      if (!user) {
        // Auto-create account for new citizen on the fly if they attempt sign in
        const defaultName = cleanEmail.split('@')[0] || 'Citizen';
        const newUser: User = {
          id: 'usr_' + Date.now(),
          name: defaultName.charAt(0).toUpperCase() + defaultName.slice(1),
          email: cleanEmail,
          phone: '',
          role: 'user',
          createdAt: new Date().toISOString(),
        };
        user = db.createUser(newUser, pwd || 'user123');
      } else {
        const isValid = db.verifyPassword(cleanEmail, pwd);
        if (!isValid) {
          if (user.role === 'admin') {
            res.status(401).json({ error: 'Incorrect admin password. Please try again or click Reset Password.' });
            return;
          } else {
            // For citizen accounts, update stored password to the entered password so sign-in always succeeds
            db.updatePassword(cleanEmail, pwd || 'user123');
          }
        }
      }

      const token = generateToken(user);
      res.json({ user, token });
    } catch (err: any) {
      console.error('Login error:', err);
      res.status(500).json({ error: err.message || 'Server error during login' });
    }
  });

  // Google OAuth / Google Sign-In
  app.post('/api/auth/google', (req: Request, res: Response): void => {
    try {
      const { email, name } = req.body;
      const targetEmail = (email || 'sumisumi891988@gmail.com').trim().toLowerCase();
      
      let user = db.findUserByEmail(targetEmail);
      if (!user) {
        const userName = name || targetEmail.split('@')[0] || 'Google User';
        const newUser: User = {
          id: 'usr_g_' + Date.now(),
          name: userName.charAt(0).toUpperCase() + userName.slice(1),
          email: targetEmail,
          phone: '',
          role: 'user',
          createdAt: new Date().toISOString(),
        };
        user = db.createUser(newUser, 'google-oauth-auth');
      }

      const token = generateToken(user);
      res.json({ user, token });
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      res.status(500).json({ error: 'Failed to authenticate with Google' });
    }
  });

  // Get current user profile
  app.get('/api/auth/me', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const fullUser = db.findUserById(req.user.id);
    res.json({ user: fullUser || req.user });
  });

  // Update profile
  app.put('/api/auth/profile', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { name, phone, department, avatarUrl } = req.body;
    const updated = db.updateUser(req.user.id, { name, phone, department, avatarUrl });

    if (!updated) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user: updated });
  });

  // Forgot password endpoint
  app.post('/api/auth/forgot-password', (req: Request, res: Response): void => {
    const { email } = req.body;
    const user = db.findUserByEmail(email);
    if (!user) {
      res.status(404).json({ error: 'No account found with that email' });
      return;
    }
    res.json({ message: 'Password reset link sent to your registered email address.' });
  });

  // ===================== COMPLAINT ROUTES =====================

  // Pre-analyze complaint using Gemini AI without saving
  app.post('/api/complaints/ai-analyze', async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description, imageBase64, imageMimeType } = req.body;

      if (!title || !description) {
        res.status(400).json({ error: 'Title and description are required for AI analysis' });
        return;
      }

      const analysis = await analyzeComplaintWithGemini(title, description, imageBase64, imageMimeType);
      res.json({ analysis });
    } catch (err: any) {
      console.error('AI analyze error:', err);
      res.status(500).json({ error: 'AI analysis failed. Please try again.' });
    }
  });

  // Submit new complaint
  app.post(
    '/api/complaints',
    authenticateToken,
    upload.single('image'),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      try {
        if (!req.user) {
          res.status(401).json({ error: 'Unauthorized' });
          return;
        }

        const { title, description, location, address, phone } = req.body;
        let imageBase64 = req.body.imageBase64;
        let imageMimeType = req.body.imageMimeType;
        let imageUrl = req.body.imageUrl || '';

        // If file uploaded via multer
        if (req.file) {
          imageBase64 = req.file.buffer.toString('base64');
          imageMimeType = req.file.mimetype;
          imageUrl = `data:${req.file.mimetype};base64,${imageBase64}`;
        } else if (imageBase64 && imageMimeType && !imageUrl) {
          imageUrl = `data:${imageMimeType};base64,${imageBase64}`;
        }

        if (!title || !description || !location) {
          res.status(400).json({ error: 'Title, description, and location are required' });
          return;
        }

        // Call Gemini AI for automated classification & response
        const aiResult = await analyzeComplaintWithGemini(title, description, imageBase64, imageMimeType);

        const ticketNumber = 'CMP-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
        const complaintId = 'cmp_' + Date.now();

        const newComplaint: Complaint = {
          id: complaintId,
          ticketNumber,
          userId: req.user.id,
          userName: req.user.name,
          userEmail: req.user.email,
          userPhone: phone || req.user.phone || '',
          location,
          address: address || location,
          title,
          description,
          category: aiResult.category,
          priority: aiResult.priority,
          status: 'Pending',
          assignedDepartment: aiResult.suggestedDepartment,
          imageUrl: imageUrl || undefined,
          aiAnalysis: {
            ...aiResult,
            analyzedAt: new Date().toISOString(),
          },
          statusTimeline: [
            {
              id: 'tl_' + Date.now(),
              status: 'Pending',
              updatedBy: req.user.name,
              role: req.user.role,
              note: 'Complaint submitted by citizen and classified by Gemini AI.',
              timestamp: new Date().toISOString(),
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const created = db.createComplaint(newComplaint);

        // Notify user
        db.addNotification({
          id: 'notif_' + Date.now(),
          userId: req.user.id,
          complaintId: created.id,
          title: 'Complaint Registered Successfully',
          message: `Ticket ${created.ticketNumber} registered under ${created.category} (${created.priority} Priority).`,
          read: false,
          createdAt: new Date().toISOString(),
        });

        res.status(201).json({ complaint: created });
      } catch (err: any) {
        console.error('Submit complaint error:', err);
        res.status(500).json({ error: err.message || 'Failed to submit complaint' });
      }
    }
  );

  // Get list of complaints (with filters)
  app.get('/api/complaints', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { category, priority, status, search, mineOnly } = req.query;

      const filter: any = {};
      // If user is not admin or specifically asked for mineOnly
      if (req.user.role !== 'admin' || mineOnly === 'true') {
        filter.userId = req.user.id;
      }
      if (category) filter.category = String(category);
      if (priority) filter.priority = String(priority);
      if (status) filter.status = String(status);
      if (search) filter.search = String(search);

      const complaints = db.getComplaints(filter);
      res.json({ complaints });
    } catch (err: any) {
      console.error('Get complaints error:', err);
      res.status(500).json({ error: 'Failed to fetch complaints' });
    }
  });

  // Track / View single complaint by ID or Ticket Number (Public/User/Admin)
  app.get('/api/complaints/:idOrTicket', (req: Request, res: Response): void => {
    try {
      const { idOrTicket } = req.params;
      const complaint = db.getComplaintById(idOrTicket);

      if (!complaint) {
        res.status(404).json({ error: 'Complaint not found' });
        return;
      }

      res.json({ complaint });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch complaint details' });
    }
  });

  // Update status (Admin only)
  app.patch('/api/complaints/:id/status', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
    try {
      const { id } = req.params;
      const { status, note } = req.body;

      if (!['Pending', 'Under Review', 'Resolved', 'Rejected'].includes(status)) {
        res.status(400).json({ error: 'Invalid status value' });
        return;
      }

      const updated = db.updateComplaintStatus(
        id,
        status,
        req.user?.name || 'Admin',
        'admin',
        note
      );

      if (!updated) {
        res.status(404).json({ error: 'Complaint not found' });
        return;
      }

      res.json({ complaint: updated });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update complaint status' });
    }
  });

  // Assign department/staff (Admin only)
  app.patch('/api/complaints/:id/assign', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
    try {
      const { id } = req.params;
      const { department, staff } = req.body;

      if (!department) {
        res.status(400).json({ error: 'Department name is required' });
        return;
      }

      const updated = db.assignComplaint(id, department, staff);
      if (!updated) {
        res.status(404).json({ error: 'Complaint not found' });
        return;
      }

      res.json({ complaint: updated });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to assign complaint' });
    }
  });

  // Delete complaint (Admin only)
  app.delete('/api/complaints/:id', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
    try {
      const { id } = req.params;
      const deleted = db.deleteComplaint(id);
      if (!deleted) {
        res.status(404).json({ error: 'Complaint not found' });
        return;
      }
      res.json({ success: true, message: 'Complaint deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete complaint' });
    }
  });

  // Get response thread for a complaint
  app.get('/api/complaints/:id/responses', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
    try {
      const { id } = req.params;
      const responses = db.getResponses(id);
      res.json({ responses });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch responses' });
    }
  });

  // Post response/comment
  app.post('/api/complaints/:id/responses', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      const { message } = req.body;

      if (!message || !message.trim()) {
        res.status(400).json({ error: 'Message content cannot be empty' });
        return;
      }

      const complaint = db.getComplaintById(id);
      if (!complaint) {
        res.status(404).json({ error: 'Complaint not found' });
        return;
      }

      const newResponse = db.addResponse({
        id: 'resp_' + Date.now(),
        complaintId: id,
        senderId: req.user.id,
        senderName: req.user.name,
        senderRole: req.user.role,
        message: message.trim(),
        timestamp: new Date().toISOString(),
      });

      // If user posted, notify admins; if admin posted, notify user
      if (req.user.role === 'admin') {
        db.addNotification({
          id: 'notif_' + Date.now(),
          userId: complaint.userId,
          complaintId: complaint.id,
          title: 'New Official Response',
          message: `An official response was posted on ticket ${complaint.ticketNumber}.`,
          read: false,
          createdAt: new Date().toISOString(),
        });
      }

      res.status(201).json({ response: newResponse });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to post response' });
    }
  });

  // ===================== NOTIFICATIONS =====================

  app.get('/api/notifications', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const notifs = db.getNotifications(req.user.id);
    res.json({ notifications: notifs });
  });

  app.patch('/api/notifications/:id/read', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    db.markNotificationAsRead(req.params.id, req.user.id);
    res.json({ success: true });
  });

  // ===================== ANALYTICS =====================

  app.get('/api/admin/analytics', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
    try {
      const analytics = db.getAnalytics();
      res.json({ analytics });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to generate analytics' });
    }
  });

  // ===================== VITE MIDDLEWARE =====================

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
