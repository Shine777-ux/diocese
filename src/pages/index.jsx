import React, { useState, useEffect, useContext } from 'react';
import { ThemeModeContext } from './_app';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  Typography, 
  Divider, 
  IconButton, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  TextField, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  Checkbox, 
  FormControlLabel, 
  Avatar, 
  InputAdornment, 
  Collapse,
  Badge,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Snackbar,
  Alert,
  CircularProgress,
  LinearProgress,
  Chip,
  Stack,
  Tabs,
  Tab
} from '@mui/material';

// Icons
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ChurchIcon from '@mui/icons-material/Church';
import PeopleIcon from '@mui/icons-material/People';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import RoomIcon from '@mui/icons-material/Room';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BookIcon from '@mui/icons-material/Book';
import ManIcon from '@mui/icons-material/Man';
import WomanIcon from '@mui/icons-material/Woman';
import CakeIcon from '@mui/icons-material/Cake';
import SchoolIcon from '@mui/icons-material/School';
import LockIcon from '@mui/icons-material/Lock';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ReceiptIcon from '@mui/icons-material/ReceiptLong';
import CampaignIcon from '@mui/icons-material/Campaign';
import EventIcon from '@mui/icons-material/Event';
import PrintIcon from '@mui/icons-material/Print';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';

const drawerWidth = 260;
const collapsedDrawerWidth = 68;

function AvatarUploader({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleAvatarClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/dh204qg0m/image/upload`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        onChange(data.secure_url);
      } else {
        alert('Image upload failed. Please try again.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Network error uploading image.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
      <Box sx={{ position: 'relative' }}>
        <Avatar 
          src={value} 
          sx={{ width: 90, height: 90, border: '2px solid rgba(99, 102, 241, 0.5)', cursor: 'pointer' }}
          onClick={handleAvatarClick}
        />
        {uploading && (
          <Box sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            borderRadius: '50%', 
            bgcolor: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <CircularProgress size={30} sx={{ color: 'white' }} />
          </Box>
        )}
        <IconButton 
          onClick={handleAvatarClick}
          sx={{ 
            position: 'absolute', 
            bottom: -5, 
            right: -5, 
            bgcolor: '#6366f1', 
            color: 'white',
            size: 'small',
            p: 0.5,
            '&:hover': { bgcolor: '#4f46e5' }
          }}
        >
          <EditIcon sx={{ fontSize: 14 }} />
        </IconButton>
      </Box>
      <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary', fontWeight: 600 }}>
        Click to upload photo
      </Typography>
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileChange}
        accept="image/*"
      />
    </Box>
  );
}

export default function DioceseErpIndex() {
  const { mode, toggleThemeMode } = useContext(ThemeModeContext);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const currentDrawerWidth = drawerOpen ? drawerWidth : collapsedDrawerWidth;
  
  // Auth Session States
  const [session, setSession] = useState(null);
  const [users, setUsers] = useState([]);
  const [userForm, setUserForm] = useState({ 
    username: '', 
    password: '', 
    role: 'Parish Priest', 
    avatar_url: '',
    deanery_id: '',
    parish_id: ''
  });
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  
  // Dynamic Permissions States
  const [userPermissions, setUserPermissions] = useState([]);
  const [permissionsRole, setPermissionsRole] = useState('Bishop');
  const [permissionsType, setPermissionsType] = useState('all');
  const [permissionsSearch, setPermissionsSearch] = useState('');
  const [rolePermissionsMatrix, setRolePermissionsMatrix] = useState([]);
  
  // Hierarchy selection & subtabs
  const [activeDioceseId, setActiveDioceseId] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('dashboard');
  
  // Core Data States
  const [dioceses, setDioceses] = useState([]);
  const [deaneries, setDeaneries] = useState([]);
  const [parishes, setParishes] = useState([]);
  const [members, setMembers] = useState([]);
  
  // Extended Modules Data States
  const [circulars, setCirculars] = useState([]);
  const [events, setEvents] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [contributionsSummary, setContributionsSummary] = useState(null);

  // Commissions & Competitions States
  const [commissions, setCommissions] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [commissionViewTab, setCommissionViewTab] = useState(0); // 0: Commissions Directory, 1: Programs & Competitions, 2: Leaderboard
  const [filterCommissionId, setFilterCommissionId] = useState('all');
  const [filterProgramType, setFilterProgramType] = useState('all');
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [participantsModalOpen, setParticipantsModalOpen] = useState(false);
  const [programParticipants, setProgramParticipants] = useState([]);
  
  // Member filters
  const [membersSearch, setMembersSearch] = useState('');
  const [membersParishFilter, setMembersParishFilter] = useState('all');
  const [membersRoleFilter, setMembersRoleFilter] = useState('all');
  const [membersSacramentFilter, setMembersSacramentFilter] = useState('all');

  // Modal dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(''); // diocese, deanery, parish, member, circular, event, contribution, program, participant, award
  const [editItem, setEditItem] = useState(null);
  
  // Profile Drawer
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Toast Notification States
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success');

  // Custom Confirmation Dialog States
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');
  const [onConfirmCallback, setOnConfirmCallback] = useState(null);

  // Helper Triggers
  const showToast = (message, severity = 'success') => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  const askConfirmation = (title, message, callback) => {
    setConfirmTitle(title);
    setConfirmMessage(message);
    setOnConfirmCallback(() => callback);
    setConfirmOpen(true);
  };

  // Form states
  const [dioceseForm, setDioceseForm] = useState({ name: '', bishop: '', founded: '', email: '', phone: '', address: '' });
  const [deaneryForm, setDeaneryForm] = useState({ diocese_id: '', name: '', dean: '', description: '' });
  const [parishForm, setParishForm] = useState({ diocese_id: '', deanery_id: '', name: '', pastor: '', assistant_pastor: '', address: '', phone: '', email: '' });
  const [memberForm, setMemberForm] = useState({
    parish_id: '', first_name: '', last_name: '', gender: 'Male', dob: '', email: '', phone: '', address: '', role: 'Lay people', avatar_url: '',
    baptism_received: false, baptism_date: '', baptism_parish: '',
    communion_received: false, communion_date: '', communion_parish: '',
    confirmation_received: false, confirmation_date: '', confirmation_parish: '',
    marriage_received: false, marriage_date: '', marriage_parish: '',
    holy_orders_received: false, holy_orders_date: '', holy_orders_parish: ''
  });

  const [circularForm, setCircularForm] = useState({
    title: '', content: '', priority: 'Normal', author: '', parish_id: '', deanery_id: ''
  });

  const [eventForm, setEventForm] = useState({
    parish_id: '', title: '', description: '', event_type: 'Mass', start_time: '', end_time: '', location: ''
  });

  const [contributionForm, setContributionForm] = useState({
    parish_id: '', member_id: '', category: 'Sunday Tithe', amount: '', payment_method: 'Cash', reference_no: '', payment_date: new Date().toISOString().split('T')[0], notes: ''
  });

  // Commission Program Form
  const [programForm, setProgramForm] = useState({
    commission_id: '', parish_id: '', title: '', description: '', type: 'Competition',
    target_audience: 'Youth', start_date: '', end_date: '', venue: '', registration_deadline: '',
    eligibility: '', guidelines: '', max_participants: '', contact_person: '', contact_phone: '', status: 'Upcoming'
  });

  // Participant Register Form
  const [participantForm, setParticipantForm] = useState({
    program_id: '', parish_id: '', member_id: '', participant_name: '', age: '',
    gender: 'Male', contact_phone: '', contact_email: '', team_name: '', category: 'General'
  });

  // Award Update Form
  const [awardForm, setAwardForm] = useState({
    participant_id: '', score: '', rank: '1st Prize', certificate_issued: 1
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  const getAbsoluteUrl = (url) => {
    if (url.startsWith('/api/')) {
      const base = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
      return `${base}${url}`;
    }
    return url;
  };

  const authenticatedFetch = async (url, options = {}) => {
    const absUrl = getAbsoluteUrl(url);
    const savedSession = localStorage.getItem('diocese_erp_session');
    if (!savedSession) return fetch(absUrl, options);
    
    try {
      const parsed = JSON.parse(savedSession);
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
        'Authorization': `Bearer ${parsed.token}`
      };
      return fetch(absUrl, { ...options, headers });
    } catch (e) {
      return fetch(absUrl, options);
    }
  };

  const downloadFile = async (endpoint, filename) => {
    try {
      showToast('Generating document, please wait...', 'info');
      const res = await authenticatedFetch(endpoint);
      if (!res.ok) {
        let msg = 'Failed to generate document';
        try {
          const err = await res.json();
          msg = err.detail || msg;
        } catch (_) {}
        showToast(msg, 'error');
        return;
      }
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      showToast('Downloaded successfully!', 'success');
    } catch (error) {
      console.error('Download error:', error);
      showToast('Error downloading file.', 'error');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!loginForm.username || !loginForm.password) {
      setLoginError('Please enter both username and password.');
      return;
    }
    try {
      const res = await fetch(getAbsoluteUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('diocese_erp_session', JSON.stringify(data));
        setSession(data);
        showToast(`Welcome back, ${data.user?.username || data.username}!`, 'success');
      } else {
        const err = await res.json();
        setLoginError(err.detail || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error("Login connection error:", error);
      setLoginError(`Could not connect to the authentication server at: ${getAbsoluteUrl('/api/auth/login')}.`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('diocese_erp_session');
    setSession(null);
    setActiveSubTab('dashboard');
    showToast('Logged out successfully.', 'info');
  };

  const handleRegisterUserSubmit = async (e) => {
    e.preventDefault();
    if (!userForm.username || !userForm.password) {
      showToast('Please fill in username and password fields.', 'error');
      return;
    }
    try {
      const payload = {
        ...userForm,
        deanery_id: userForm.deanery_id ? parseInt(userForm.deanery_id) : null,
        parish_id: userForm.parish_id ? parseInt(userForm.parish_id) : null,
      };
      const res = await authenticatedFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast('User created successfully!', 'success');
        setUserForm({ username: '', password: '', role: 'Parish Priest', avatar_url: '', deanery_id: '', parish_id: '' });
        fetchUsers();
      } else {
        const err = await res.json();
        showToast(err.detail || 'Failed to create user.', 'error');
      }
    } catch (error) {
      showToast('Server connection error.', 'error');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await authenticatedFetch('/api/auth/users');
      if (res.ok) {
        setUsers(await res.json());
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchDioceses = async () => {
    try {
      const res = await authenticatedFetch('/api/dioceses');
      if (res.ok) {
        const data = await res.json();
        setDioceses(data);
        if (data.length > 0) {
          setActiveDioceseId(prev => prev || data[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching dioceses:', err);
    }
  };

  const fetchDeaneries = async () => {
    try {
      const res = await authenticatedFetch('/api/deaneries');
      if (res.ok) setDeaneries(await res.json());
    } catch (err) {
      console.error('Error fetching deaneries:', err);
    }
  };

  const fetchParishes = async () => {
    try {
      const res = await authenticatedFetch('/api/parishes');
      if (res.ok) setParishes(await res.json());
    } catch (err) {
      console.error('Error fetching parishes:', err);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await authenticatedFetch('/api/members');
      if (res.ok) setMembers(await res.json());
    } catch (err) {
      console.error('Error fetching members:', err);
    }
  };

  const fetchCirculars = async () => {
    try {
      const res = await authenticatedFetch('/api/circulars');
      if (res.ok) setCirculars(await res.json());
    } catch (err) {
      console.error('Error fetching circulars:', err);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await authenticatedFetch('/api/events');
      if (res.ok) setEvents(await res.json());
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const fetchContributions = async () => {
    try {
      const [listRes, summaryRes] = await Promise.all([
        authenticatedFetch('/api/contributions'),
        authenticatedFetch('/api/contributions/summary')
      ]);
      if (listRes.ok) setContributions(await listRes.json());
      if (summaryRes.ok) setContributionsSummary(await summaryRes.json());
    } catch (err) {
      console.error('Error fetching contributions:', err);
    }
  };

  const fetchCommissions = async () => {
    try {
      const res = await authenticatedFetch('/api/commissions');
      if (res.ok) setCommissions(await res.json());
    } catch (err) {
      console.error('Error fetching commissions:', err);
    }
  };

  const fetchPrograms = async () => {
    try {
      const res = await authenticatedFetch('/api/programs');
      if (res.ok) setPrograms(await res.json());
    } catch (err) {
      console.error('Error fetching programs:', err);
    }
  };

  const fetchProgramParticipants = async (programId) => {
    try {
      const res = await authenticatedFetch(`/api/programs/${programId}/participants`);
      if (res.ok) setProgramParticipants(await res.json());
    } catch (err) {
      console.error('Error fetching program participants:', err);
    }
  };

  const fetchBootstrap = async () => {
    try {
      const res = await authenticatedFetch('/api/bootstrap');
      if (res.ok) {
        const data = await res.json();
        if (data.dioceses) {
          setDioceses(data.dioceses);
          if (data.dioceses.length > 0) {
            setActiveDioceseId(prev => prev || data.dioceses[0].id);
          }
        }
        if (data.deaneries) setDeaneries(data.deaneries);
        if (data.parishes) setParishes(data.parishes);
        if (data.members) setMembers(data.members);
      }
    } catch (err) {
      console.warn('Bootstrap fetch fallback:', err);
      fetchDioceses();
      fetchDeaneries();
      fetchParishes();
      fetchMembers();
    }
    fetchCirculars();
    fetchEvents();
    fetchContributions();
    fetchCommissions();
    fetchPrograms();
  };

  useEffect(() => {
    const savedSession = localStorage.getItem('diocese_erp_session');
    if (savedSession) {
      try {
        setSession(JSON.parse(savedSession));
      } catch (e) {
        console.error('Error loading saved session:', e);
      }
    }
  }, []);

  const fetchUserPermissions = async () => {
    if (!session) return;
    const roleName = session.user?.role || session.role || 'Lay people';
    try {
      const res = await authenticatedFetch(`/api/permissions?role=${encodeURIComponent(roleName)}`);
      if (res.ok) {
        setUserPermissions(await res.json());
      }
    } catch (e) {
      console.error("Error loading user permissions:", e);
    }
  };

  const fetchRolePermissionsMatrix = async (roleName) => {
    try {
      const res = await authenticatedFetch(`/api/permissions?role=${encodeURIComponent(roleName)}`);
      if (res.ok) {
        setRolePermissionsMatrix(await res.json());
      }
    } catch (e) {
      console.error("Error loading permissions matrix:", e);
    }
  };

  const handleCheckboxChange = (index, colField) => {
    setRolePermissionsMatrix(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [colField]: updated[index][colField] === 1 ? 0 : 1
      };
      return updated;
    });
  };

  const handlePermissionsSubmit = async () => {
    try {
      const res = await authenticatedFetch('/api/permissions', {
        method: 'POST',
        body: JSON.stringify({
          role: permissionsRole,
          permissions: rolePermissionsMatrix
        })
      });
      if (res.ok) {
        showToast('Permissions saved successfully!', 'success');
        fetchUserPermissions();
      } else {
        const err = await res.json();
        showToast(err.detail || 'Failed to save permissions.', 'error');
      }
    } catch (e) {
      showToast('Connection error.', 'error');
    }
  };

  useEffect(() => {
    if (session) {
      if (activeSubTab === 'dashboard') {
        fetchBootstrap();
      } else if (activeSubTab === 'dioceses') {
        fetchDioceses();
      } else if (activeSubTab === 'deaneries') {
        fetchDioceses();
        fetchDeaneries();
      } else if (activeSubTab === 'parishes') {
        fetchDioceses();
        fetchDeaneries();
        fetchParishes();
      } else if (activeSubTab === 'members') {
        fetchParishes();
        fetchMembers();
      } else if (activeSubTab === 'circulars') {
        fetchCirculars();
      } else if (activeSubTab === 'events') {
        fetchEvents();
        fetchParishes();
      } else if (activeSubTab === 'contributions') {
        fetchContributions();
        fetchParishes();
        fetchMembers();
      } else if (activeSubTab === 'commissions') {
        fetchCommissions();
        fetchPrograms();
        fetchParishes();
        fetchMembers();
      } else if (activeSubTab === 'users') {
        fetchUsers();
        fetchDeaneries();
        fetchParishes();
      }
      fetchUserPermissions();
    }
  }, [activeSubTab, session]);

  useEffect(() => {
    if (session) {
      fetchRolePermissionsMatrix(permissionsRole);
    }
  }, [permissionsRole, session]);

  // Active diocese entity
  const activeDiocese = dioceses.find(d => d.id === activeDioceseId);

  // Role permissions helpers
  const userRole = (session?.user?.role || session?.role || '').toLowerCase();
  const isSuper = userRole === 'admin' || userRole === 'administrator' || userRole === 'bishop';
  const isDean = userRole === 'dean';
  const isParishRole = !isSuper && !isDean;
  const userDeaneryId = session?.user?.deanery_id || session?.deanery_id;
  const userParishId = session?.user?.parish_id || session?.parish_id;

  const assignedDeanery = deaneries.find(d => d.id == userDeaneryId);
  const assignedParish = parishes.find(p => p.id == userParishId);

  // Auto-enforce tab boundary for non-superusers
  useEffect(() => {
    if (!session) return;
    if (!isSuper && (activeSubTab === 'dioceses' || activeSubTab === 'users' || activeSubTab === 'permissions')) {
      setActiveSubTab('dashboard');
    }
    if (isParishRole && activeSubTab === 'deaneries') {
      setActiveSubTab('dashboard');
    }
  }, [activeSubTab, isSuper, isParishRole, session]);

  const hasPermission = (pageName, actionName) => {
    if (isSuper) return true;
    const perm = userPermissions.find(p => p.page.toLowerCase() === pageName.toLowerCase());
    if (!perm) return false;
    return perm[`can_${actionName}`] === 1;
  };

  const canManageDiocese = isSuper;
  const canManageDeaneries = isSuper;
  const canManageParishes = isSuper || isDean;
  const canManageMembers = isSuper || isDean || hasPermission("Parishioners", "create");
  const canOrganizeProgram = isSuper || isDean || userRole === 'parish priest';

  const canViewDiocese = isSuper;
  const canViewDeaneries = isSuper || isDean;
  const canViewUsers = isSuper;
  const canViewPermissions = isSuper;

  // Scoped lists
  const filteredDeaneries = deaneries.filter(d => {
    if (isDean && userDeaneryId && d.id != userDeaneryId) return false;
    if (isSuper && activeDioceseId && d.diocese_id && d.diocese_id != activeDioceseId) return false;
    return true;
  });

  const filteredParishes = parishes.filter(p => {
    if (isParishRole && userParishId && p.id != userParishId) return false;
    if (isDean && userDeaneryId && p.deanery_id && p.deanery_id != userDeaneryId) return false;
    if (isSuper && activeDioceseId && p.diocese_id && p.diocese_id != activeDioceseId) return false;
    return true;
  });

  const filteredMembers = members.filter(m => {
    if (isParishRole && userParishId && m.parish_id != userParishId) return false;
    if (isDean && userDeaneryId) {
      const p = parishes.find(item => item.id == m.parish_id);
      if (p && p.deanery_id && p.deanery_id != userDeaneryId) return false;
    }
    if (isSuper && activeDioceseId && parishes.length > 0) {
      const p = parishes.find(item => item.id == m.parish_id);
      if (p && p.diocese_id && p.diocese_id != activeDioceseId) return false;
    }

    const matchesSearch = 
      (m.first_name || '').toLowerCase().includes(membersSearch.toLowerCase()) ||
      (m.last_name || '').toLowerCase().includes(membersSearch.toLowerCase()) ||
      (m.email || '').toLowerCase().includes(membersSearch.toLowerCase()) ||
      (m.phone || '').toLowerCase().includes(membersSearch.toLowerCase()) ||
      (m.address || '').toLowerCase().includes(membersSearch.toLowerCase());

    const matchesParish = membersParishFilter === 'all' || m.parish_id == membersParishFilter;
    const matchesRole = membersRoleFilter === 'all' || m.role === membersRoleFilter;

    let matchesSacrament = true;
    if (membersSacramentFilter !== 'all') {
      matchesSacrament = m[`${membersSacramentFilter}_received`] === 1;
    }

    return matchesSearch && matchesParish && matchesRole && matchesSacrament;
  });

  // Filtered Programs list
  const filteredPrograms = programs.filter(p => {
    if (filterCommissionId !== 'all' && p.commission_id != filterCommissionId) return false;
    if (filterProgramType !== 'all' && p.type !== filterProgramType) return false;
    return true;
  });

  // Staff and parishioner categorizations
  const staffList = filteredMembers.filter(m => m.role !== 'Laity' && m.role !== 'Parishioner' && m.role !== 'Lay people');
  const parishionerBirthdays = filteredMembers.filter(m => {
    if (!m.dob) return false;
    const dob = new Date(m.dob);
    const today = new Date();
    return dob.getDate() === today.getDate() && dob.getMonth() === today.getMonth();
  });

  // Dialog Opens
  const handleOpenAdd = (type) => {
    setDialogType(type);
    setEditItem(null);
    if (type === 'diocese') {
      setDioceseForm({ name: '', bishop: '', founded: '', email: '', phone: '', address: '' });
    } else if (type === 'deanery') {
      setDeaneryForm({ diocese_id: activeDioceseId, name: '', dean: '', description: '' });
    } else if (type === 'parish') {
      const defaultDeanery = isDean ? (userDeaneryId || '') : (filteredDeaneries[0]?.id || '');
      setParishForm({ 
        diocese_id: activeDioceseId, 
        deanery_id: defaultDeanery, 
        name: '', pastor: '', assistant_pastor: '', address: '', phone: '', email: '' 
      });
    } else if (type === 'member') {
      const defaultParish = isParishRole ? (userParishId || '') : (filteredParishes[0]?.id || '');
      setMemberForm({
        parish_id: defaultParish, first_name: '', last_name: '', gender: 'Male', dob: '', email: '', phone: '', address: '', role: 'Lay people', avatar_url: '',
        baptism_received: false, baptism_date: '', baptism_parish: '',
        communion_received: false, communion_date: '', communion_parish: '',
        confirmation_received: false, confirmation_date: '', confirmation_parish: '',
        marriage_received: false, marriage_date: '', marriage_parish: '',
        holy_orders_received: false, holy_orders_date: '', holy_orders_parish: ''
      });
    } else if (type === 'circular') {
      setCircularForm({
        title: '', content: '', priority: 'Normal', author: session?.user?.role || 'Chancery Office',
        parish_id: isParishRole ? userParishId : '', deanery_id: isDean ? userDeaneryId : ''
      });
    } else if (type === 'event') {
      setEventForm({
        parish_id: isParishRole ? userParishId : (filteredParishes[0]?.id || ''),
        title: '', description: '', event_type: 'Mass', start_time: '', end_time: '', location: ''
      });
    } else if (type === 'contribution') {
      setContributionForm({
        parish_id: isParishRole ? userParishId : (filteredParishes[0]?.id || ''),
        member_id: '', category: 'Sunday Tithe', amount: '', payment_method: 'Cash', reference_no: `TXN-${Date.now().toString().slice(-6)}`,
        payment_date: new Date().toISOString().split('T')[0], notes: ''
      });
    } else if (type === 'program') {
      setProgramForm({
        commission_id: commissions[0]?.id || '',
        parish_id: isParishRole ? userParishId : '',
        title: '',
        description: '',
        type: 'Competition',
        target_audience: 'Youth',
        start_date: '',
        end_date: '',
        venue: 'Cathedral Pastoral Center',
        registration_deadline: '',
        eligibility: '',
        guidelines: '',
        max_participants: '',
        contact_person: '',
        contact_phone: '',
        status: 'Upcoming'
      });
    }
    setDialogOpen(true);
  };

  const handleOpenRegisterParticipant = (prog) => {
    setSelectedProgram(prog);
    setDialogType('participant');
    setParticipantForm({
      program_id: prog.id,
      parish_id: isParishRole ? userParishId : (filteredParishes[0]?.id || ''),
      member_id: '',
      participant_name: '',
      age: '',
      gender: 'Male',
      contact_phone: '',
      contact_email: '',
      team_name: '',
      category: 'General'
    });
    setDialogOpen(true);
  };

  const handleOpenAwardModal = (part) => {
    setEditItem(part);
    setDialogType('award');
    setAwardForm({
      participant_id: part.id,
      score: part.score || '',
      rank: part.rank || '1st Prize',
      certificate_issued: 1
    });
    setDialogOpen(true);
  };

  const handleViewParticipants = async (prog) => {
    setSelectedProgram(prog);
    await fetchProgramParticipants(prog.id);
    setParticipantsModalOpen(true);
  };

  const handleOpenEdit = (type, item) => {
    setDialogType(type);
    setEditItem(item);
    if (type === 'diocese') {
      setDioceseForm({
        name: item.name || '',
        bishop: item.bishop || '',
        founded: item.founded || '',
        email: item.email || '',
        phone: item.phone || '',
        address: item.address || ''
      });
    } else if (type === 'deanery') {
      setDeaneryForm({
        diocese_id: item.diocese_id || '',
        name: item.name || '',
        dean: item.dean || '',
        description: item.description || ''
      });
    } else if (type === 'parish') {
      setParishForm({
        diocese_id: item.diocese_id || '',
        deanery_id: item.deanery_id || '',
        name: item.name || '',
        pastor: item.pastor || '',
        assistant_pastor: item.assistant_pastor || '',
        address: item.address || '',
        phone: item.phone || '',
        email: item.email || ''
      });
    } else if (type === 'member') {
      setMemberForm({
        parish_id: item.parish_id || '',
        first_name: item.first_name || '',
        last_name: item.last_name || '',
        gender: item.gender || 'Male',
        dob: item.dob || '',
        email: item.email || '',
        phone: item.phone || '',
        address: item.address || '',
        role: item.role || 'Lay people',
        avatar_url: item.avatar_url || '',
        baptism_received: item.baptism_received === 1,
        baptism_date: item.baptism_date || '',
        baptism_parish: item.baptism_parish || '',
        communion_received: item.communion_received === 1,
        communion_date: item.communion_date || '',
        communion_parish: item.communion_parish || '',
        confirmation_received: item.confirmation_received === 1,
        confirmation_date: item.confirmation_date || '',
        confirmation_parish: item.confirmation_parish || '',
        marriage_received: item.marriage_received === 1,
        marriage_date: item.marriage_date || '',
        marriage_parish: item.marriage_parish || '',
        holy_orders_received: item.holy_orders_received === 1,
        holy_orders_date: item.holy_orders_date || '',
        holy_orders_parish: item.holy_orders_parish || ''
      });
    } else if (type === 'program') {
      setProgramForm({
        commission_id: item.commission_id || '',
        parish_id: item.parish_id || '',
        title: item.title || '',
        description: item.description || '',
        type: item.type || 'Competition',
        target_audience: item.target_audience || 'Youth',
        start_date: item.start_date || '',
        end_date: item.end_date || '',
        venue: item.venue || '',
        registration_deadline: item.registration_deadline || '',
        eligibility: item.eligibility || '',
        guidelines: item.guidelines || '',
        max_participants: item.max_participants || '',
        contact_person: item.contact_person || '',
        contact_phone: item.contact_phone || '',
        status: item.status || 'Upcoming'
      });
    }
    setDialogOpen(true);
  };

  // Form submit handler
  const handleSave = async () => {
    let url = '';
    let method = editItem ? 'PUT' : 'POST';
    let body = {};

    if (dialogType === 'diocese') {
      url = '/api/dioceses';
      body = dioceseForm;
    } else if (dialogType === 'deanery') {
      url = '/api/deaneries';
      body = deaneryForm;
    } else if (dialogType === 'parish') {
      url = '/api/parishes';
      body = parishForm;
    } else if (dialogType === 'member') {
      url = '/api/members';
      body = {
        ...memberForm,
        baptism_received: !!memberForm.baptism_received,
        communion_received: !!memberForm.communion_received,
        confirmation_received: !!memberForm.confirmation_received,
        marriage_received: !!memberForm.marriage_received,
        holy_orders_received: !!memberForm.holy_orders_received
      };
    } else if (dialogType === 'circular') {
      url = '/api/circulars';
      body = {
        ...circularForm,
        parish_id: circularForm.parish_id ? parseInt(circularForm.parish_id) : null,
        deanery_id: circularForm.deanery_id ? parseInt(circularForm.deanery_id) : null,
      };
    } else if (dialogType === 'event') {
      url = '/api/events';
      body = {
        ...eventForm,
        parish_id: parseInt(eventForm.parish_id)
      };
    } else if (dialogType === 'contribution') {
      url = '/api/contributions';
      body = {
        ...contributionForm,
        parish_id: parseInt(contributionForm.parish_id),
        member_id: contributionForm.member_id ? parseInt(contributionForm.member_id) : null,
        amount: parseFloat(contributionForm.amount)
      };
    } else if (dialogType === 'program') {
      url = '/api/programs';
      body = {
        ...programForm,
        commission_id: parseInt(programForm.commission_id),
        parish_id: programForm.parish_id ? parseInt(programForm.parish_id) : null,
        max_participants: programForm.max_participants ? parseInt(programForm.max_participants) : null
      };
    } else if (dialogType === 'participant') {
      url = `/api/programs/${selectedProgram.id}/participants`;
      method = 'POST';
      body = {
        ...participantForm,
        program_id: selectedProgram.id,
        parish_id: parseInt(participantForm.parish_id),
        member_id: participantForm.member_id ? parseInt(participantForm.member_id) : null,
        age: participantForm.age ? parseInt(participantForm.age) : null
      };
    } else if (dialogType === 'award') {
      url = `/api/programs/participants/${editItem.id}`;
      method = 'PUT';
      body = {
        score: awardForm.score ? parseFloat(awardForm.score) : null,
        rank: awardForm.rank,
        certificate_issued: 1
      };
    }

    if (editItem && dialogType !== 'award' && dialogType !== 'participant') {
      url += `/${editItem.id}`;
    }

    try {
      const res = await authenticatedFetch(url, {
        method,
        body: JSON.stringify(body)
      });
      if (res.ok) {
        setDialogOpen(false);
        showToast(`${dialogType[0].toUpperCase() + dialogType.slice(1)} saved successfully`, 'success');
        if (dialogType === 'diocese') fetchDioceses();
        else if (dialogType === 'deanery') fetchDeaneries();
        else if (dialogType === 'parish') fetchParishes();
        else if (dialogType === 'member') fetchMembers();
        else if (dialogType === 'circular') fetchCirculars();
        else if (dialogType === 'event') fetchEvents();
        else if (dialogType === 'contribution') fetchContributions();
        else if (dialogType === 'program') fetchPrograms();
        else if (dialogType === 'participant' || dialogType === 'award') {
          if (selectedProgram) fetchProgramParticipants(selectedProgram.id);
          fetchPrograms();
        }

        if (selectedMember && dialogType === 'member' && editItem && selectedMember.id === editItem.id) {
          const updatedMemberRes = await authenticatedFetch(`/api/members/${editItem.id}`);
          if (updatedMemberRes.ok) {
            setSelectedMember(await updatedMemberRes.json());
          }
        }
      } else {
        const errorData = await res.json();
        showToast(`Error saving: ${errorData.detail || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      showToast('An unexpected error occurred while saving.', 'error');
    }
  };

  // Delete handler
  const handleDelete = (type, id) => {
    const getEndpoint = (t) => {
      if (t === 'deanery') return 'deaneries';
      if (t === 'parish') return 'parishes';
      if (t === 'circular') return 'circulars';
      if (t === 'event') return 'events';
      if (t === 'contribution') return 'contributions';
      if (t === 'program') return 'programs';
      if (t === 'participant') return 'programs/participants';
      return t + 's';
    };
    const capitalized = type[0].toUpperCase() + type.slice(1);
    askConfirmation(
      `Confirm Deletion`,
      `Are you sure you want to permanently delete this ${type}? This action cannot be undone.`,
      async () => {
        try {
          const res = await authenticatedFetch(`/api/${getEndpoint(type)}/${id}`, { method: 'DELETE' });
          if (res.ok) {
            showToast(`${capitalized} deleted successfully`, 'success');
            if (type === 'diocese') fetchDioceses();
            else if (type === 'deanery') fetchDeaneries();
            else if (type === 'parish') fetchParishes();
            else if (type === 'member') fetchMembers();
            else if (type === 'circular') fetchCirculars();
            else if (type === 'event') fetchEvents();
            else if (type === 'contribution') fetchContributions();
            else if (type === 'program') fetchPrograms();
            else if (type === 'participant' && selectedProgram) fetchProgramParticipants(selectedProgram.id);

            if (selectedMember && selectedMember.id === id && type === 'member') {
              setProfileDrawerOpen(false);
              setSelectedMember(null);
            }
          } else {
            const err = await res.json();
            showToast(`Error deleting: ${err.detail || 'Unknown error'}`, 'error');
          }
        } catch (error) {
          console.error(`Error deleting ${type}:`, error);
          showToast(`An error occurred while deleting ${type}.`, 'error');
        }
      }
    );
  };

  // Navigation Items with role-scoped access
  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, id: 'dashboard' },
    ...(canViewDiocese ? [{ text: 'Diocese Overview', icon: <RoomIcon />, id: 'dioceses' }] : []),
    ...(canViewDeaneries ? [{ text: isDean ? 'My Deanery' : 'Deaneries (Vicariates)', icon: <AccountBalanceIcon />, id: 'deaneries' }] : []),
    { text: isDean ? 'Deanery Parishes' : (isParishRole ? 'My Parish' : 'Parishes Directory'), icon: <ChurchIcon />, id: 'parishes' },
    { text: isDean ? 'Deanery Parishioners' : (isParishRole ? 'Parish Members' : 'Parishioners (Members)'), icon: <PeopleIcon />, id: 'members' },
    { text: 'Commissions & Programs', icon: <EmojiEventsIcon />, id: 'commissions' },
    { text: 'Notice Board & Circulars', icon: <CampaignIcon />, id: 'circulars' },
    { text: 'Mass Timings & Events', icon: <EventIcon />, id: 'events' },
    { text: 'Tithes & Contributions', icon: <ReceiptIcon />, id: 'contributions' },
    ...(canViewUsers ? [{ text: 'Users Registry', icon: <PeopleIcon />, id: 'users' }] : []),
    ...(canViewPermissions ? [{ text: 'Permissions Settings', icon: <LockIcon />, id: 'permissions' }] : []),
  ];

  if (!session) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        bgcolor: mode === 'dark' ? '#181f2a' : '#f0f2f5',
        p: 2 
      }}>
        <Paper 
          elevation={4} 
          sx={{ 
            p: 4, 
            width: '100%', 
            maxWidth: 440, 
            borderRadius: 3,
            border: mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)',
            bgcolor: mode === 'dark' ? '#1e2533' : '#ffffff'
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{ 
              width: 56, 
              height: 56, 
              borderRadius: 3, 
              bgcolor: 'primary.main', 
              color: 'white', 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
              mb: 2
            }}>
              <ChurchIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '0.3px' }}>
                ERP
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Enter your credentials to access your administrative dashboard
            </Typography>
          </Box>

          {loginError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {loginError}
            </Alert>
          )}

          <form onSubmit={handleLoginSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                label="Username"
                required
                fullWidth
                value={loginForm.username}
                onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
                autoFocus
              />
              <TextField
                label="Password"
                type="password"
                required
                fullWidth
                value={loginForm.password}
                onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
              />
              <Button 
                type="submit" 
                variant="contained" 
                fullWidth 
                size="large"
                sx={{ 
                  py: 1.2, 
                  fontWeight: 700, 
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 14px rgba(99,102,241,0.4)'
                }}
              >
                Sign In to Portal
              </Button>
            </Box>
          </form>

          <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 700 }}>
              Quick Demo Logins:
            </Typography>
            <Stack direction="row" spacing={0.8} sx={{ flexWrap: 'wrap', gap: 0.8 }}>
              <Chip 
                size="small" 
                label="Admin: admin / admin123" 
                onClick={() => setLoginForm({ username: 'admin', password: 'admin123' })} 
                sx={{ cursor: 'pointer' }}
              />
              <Chip 
                size="small" 
                label="Bishop: bishop_simla / bishop123" 
                onClick={() => setLoginForm({ username: 'bishop_simla', password: 'bishop123' })} 
                sx={{ cursor: 'pointer' }}
              />
              <Chip 
                size="small" 
                label="Dean: dean_karnal / dean123" 
                color="secondary"
                onClick={() => setLoginForm({ username: 'dean_karnal', password: 'dean123' })} 
                sx={{ cursor: 'pointer' }}
              />
              <Chip 
                size="small" 
                label="Priest: priest_pnp / priest123" 
                color="success"
                onClick={() => setLoginForm({ username: 'priest_pnp', password: 'priest123' })} 
                sx={{ cursor: 'pointer' }}
              />
            </Stack>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      
      {/* Top Application Bar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen(!drawerOpen)}
              sx={{ mr: 2, color: 'secondary.main' }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap sx={{ fontWeight: 800, color: 'primary.light', display: 'flex', alignItems: 'center', gap: 1 }}>
              <ChurchIcon sx={{ fontSize: 24 }} /> ERP
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {session && (
              <Box sx={{ 
                px: 2, 
                py: 0.6, 
                borderRadius: '20px', 
                bgcolor: isSuper ? 'rgba(99, 102, 241, 0.12)' : (isDean ? 'rgba(6, 182, 212, 0.12)' : 'rgba(34, 197, 94, 0.12)'), 
                border: '1px solid',
                borderColor: isSuper ? 'rgba(99, 102, 241, 0.3)' : (isDean ? 'rgba(6, 182, 212, 0.3)' : 'rgba(34, 197, 94, 0.3)'),
                display: 'flex',
                alignItems: 'center',
                gap: 1.2
              }}>
                <Avatar src={session?.user?.avatar_url || session?.avatar_url} sx={{ width: 26, height: 26 }} />
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary', textTransform: 'uppercase', display: 'block', lineHeight: 1.1 }}>
                    {session?.user?.username || session?.username} ({session?.user?.role || session?.role})
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: '0.68rem', color: isSuper ? 'primary.light' : (isDean ? 'secondary.main' : 'success.main'), fontWeight: 600 }}>
                    {isSuper ? 'Diocese-wide Jurisdiction' : (isDean ? `Deanery: ${assignedDeanery?.name || 'Assigned Vicariate'}` : `Parish: ${assignedParish?.name || 'Assigned Parish'}`)}
                  </Typography>
                </Box>
              </Box>
            )}
            
            <Tooltip title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              <IconButton onClick={toggleThemeMode} color="inherit">
                {mode === 'dark' ? <LightModeIcon sx={{ color: 'warning.light' }} /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Navigation (Mini Variant: displays icons when collapsed) */}
      <Drawer
        variant="permanent"
        sx={{
          width: currentDrawerWidth,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          [`& .MuiDrawer-paper`]: { 
            width: currentDrawerWidth, 
            overflowX: 'hidden',
            boxSizing: 'border-box', 
            borderRight: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)', 
            boxShadow: drawerOpen ? '5px 0 30px rgba(0,0,0,0.5)' : 'none',
            transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          },
        }}
      >
        <Toolbar />

        <Box sx={{ overflowX: 'hidden', overflowY: 'auto', mt: 2 }}>
          <List sx={{ px: drawerOpen ? 1 : 0.75 }}>
            {navItems.map((item) => (
              <ListItem key={item.id} disablePadding sx={{ mb: 0.5, display: 'block' }}>
                <Tooltip title={!drawerOpen ? item.text : ''} placement="right" arrow>
                  <ListItemButton 
                    selected={activeSubTab === item.id}
                    onClick={() => setActiveSubTab(item.id)}
                    sx={{
                      minHeight: 44,
                      justifyContent: drawerOpen ? 'initial' : 'center',
                      px: drawerOpen ? 2 : 1.25,
                      borderRadius: 1.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: drawerOpen ? 2 : 'auto',
                        justifyContent: 'center',
                        color: activeSubTab === item.id ? 'primary.main' : 'text.secondary',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {drawerOpen && (
                      <ListItemText 
                        primary={item.text} 
                        primaryTypographyProps={{ 
                          fontSize: '0.85rem', 
                          fontWeight: activeSubTab === item.id ? 700 : 500,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }} 
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            ))}

            <Divider sx={{ my: 2, opacity: 0.1 }} />

            <ListItem disablePadding sx={{ mb: 0.5, display: 'block' }}>
              <Tooltip title={!drawerOpen ? 'Logout' : ''} placement="right" arrow>
                <ListItemButton 
                  onClick={handleLogout}
                  sx={{
                    minHeight: 44,
                    justifyContent: drawerOpen ? 'initial' : 'center',
                    px: drawerOpen ? 2 : 1.25,
                    borderRadius: 1.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: drawerOpen ? 2 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <CloseIcon sx={{ color: 'error.main' }} />
                  </ListItemIcon>
                  {drawerOpen && (
                    <ListItemText primary="Logout" primaryTypographyProps={{ color: 'error.main', fontWeight: 700, fontSize: '0.85rem' }} />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Workspace Panel */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, sm: 3, md: 4 }, 
          mt: 8, 
          width: `calc(100% - ${currentDrawerWidth}px)`,
          transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Container maxWidth="xl" sx={{ mt: 1 }}>

          {/* 1. DASHBOARD SUB-TAB */}
          {activeSubTab === 'dashboard' && (
            <Box className="tab-content-enter-active">
              
              {/* Scoped Metric Cards */}
              <Grid container spacing={3}>
                
                {/* Metric 1 */}
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ height: 130, p: 3, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <AccountBalanceIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                        {isSuper ? 'Total Deaneries' : 'My Deanery'}
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 1 }}>
                      <div className="serif-stat-number">{filteredDeaneries.length}</div>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {isDean ? (assignedDeanery?.name || 'Assigned Deanery') : 'Active vicariates'}
                      </Typography>
                    </Box>
                    <AccountBalanceIcon sx={{ position: 'absolute', right: 16, bottom: 16, fontSize: '70px !important', color: mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', pointerEvents: 'none' }} />
                  </Card>
                </Grid>

                {/* Metric 2 */}
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ height: 130, p: 3, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <ChurchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                        {isParishRole ? 'My Parish' : (isDean ? 'Deanery Parishes' : 'Total Parishes')}
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 1 }}>
                      <div className="serif-stat-number">{filteredParishes.length}</div>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {isParishRole ? (assignedParish?.name || 'Registered parish') : 'In jurisdiction'}
                      </Typography>
                    </Box>
                    <ChurchIcon sx={{ position: 'absolute', right: 16, bottom: 16, fontSize: '70px !important', color: mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', pointerEvents: 'none' }} />
                  </Card>
                </Grid>

                {/* Metric 3 */}
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ height: 130, p: 3, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <PeopleIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                        {isParishRole ? 'Parish Members' : (isDean ? 'Deanery Members' : 'Total Parishioners')}
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 1 }}>
                      <div className="serif-stat-number">{filteredMembers.length}</div>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        Registered souls
                      </Typography>
                    </Box>
                    <PeopleIcon sx={{ position: 'absolute', right: 16, bottom: 16, fontSize: '70px !important', color: mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', pointerEvents: 'none' }} />
                  </Card>
                </Grid>

                {/* Metric 4 */}
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ height: 130, p: 3, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <EmojiEventsIcon sx={{ color: 'warning.main', fontSize: 20 }} />
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                        Commissions & Events
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 1 }}>
                      <div className="serif-stat-number">{programs.length}</div>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        Across 18 Diocesan Apostolates
                      </Typography>
                    </Box>
                    <EmojiEventsIcon sx={{ position: 'absolute', right: 16, bottom: 16, fontSize: '70px !important', color: mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', pointerEvents: 'none' }} />
                  </Card>
                </Grid>

                {/* Upcoming Diocesan Programs & Competitions Preview */}
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: 340, p: 3, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmojiEventsIcon color="warning" />
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>Diocesan Programs & Contests</Typography>
                      </Box>
                      <Button size="small" variant="outlined" onClick={() => setActiveSubTab('commissions')}>
                        View All (18)
                      </Button>
                    </Box>
                    <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                      {programs.slice(0, 3).map(p => (
                        <Box key={p.id} sx={{ p: 1.5, mb: 1.5, borderRadius: 2, bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{p.title}</Typography>
                            <Chip size="small" label={p.type} color={p.type === 'Competition' ? 'warning' : 'primary'} sx={{ height: 20, fontSize: '0.65rem' }} />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {p.commission_name} • {p.start_date}
                          </Typography>
                          <Typography variant="caption" color="text.disabled">
                            Venue: {p.venue || 'Diocesan Center'} • Audience: {p.target_audience}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Card>
                </Grid>

                {/* Notice Board Preview */}
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: 340, p: 3, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CampaignIcon color="secondary" />
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>Pastoral Circulars & Notices</Typography>
                      </Box>
                      <Button size="small" variant="outlined" onClick={() => setActiveSubTab('circulars')}>
                        View All
                      </Button>
                    </Box>
                    <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                      {circulars.slice(0, 3).map(c => (
                        <Box key={c.id} sx={{ p: 1.5, mb: 1.5, borderRadius: 2, bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{c.title}</Typography>
                            <Chip 
                              size="small" 
                              label={c.priority} 
                              color={c.priority === 'Urgent' ? 'error' : (c.priority === 'High' ? 'warning' : 'default')} 
                              sx={{ height: 20, fontSize: '0.65rem' }} 
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {c.content}
                          </Typography>
                          <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
                            By {c.author} • {c.publish_date || 'Recent'}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Card>
                </Grid>

                {/* Birthdays Cards */}
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: 200, p: 3, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, mb: 1 }}>
                      Parishioners Celebrating Today 🎉
                    </Typography>
                    <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                      {parishionerBirthdays.length > 0 ? (
                        <List dense>
                          {parishionerBirthdays.map(m => (
                            <ListItem key={m.id}>
                              <ListItemText primary={`${m.first_name} ${m.last_name}`} secondary={`Parish: ${m.parish_name}`} />
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block', textAlign: 'center' }}>
                          No parishioner birthdays today.
                        </Typography>
                      )}
                    </Box>
                  </Card>
                </Grid>

                {/* Liturgical masses */}
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: 200, p: 3, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>
                        Liturgical Schedule Today 🕊️
                      </Typography>
                      <Button size="small" onClick={() => setActiveSubTab('events')}>Schedule</Button>
                    </Box>
                    <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                      {events.slice(0, 2).map(e => (
                        <Typography key={e.id} variant="body2" sx={{ mb: 1 }}>
                          <b>{e.title}</b> • {e.start_time} ({e.parish_name || 'Diocese'})
                        </Typography>
                      ))}
                      {events.length === 0 && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
                          No scheduled masses recorded today.
                        </Typography>
                      )}
                    </Box>
                  </Card>
                </Grid>

              </Grid>
            </Box>
          )}

          {/* 2. COMMISSIONS, COMPETITIONS & PROGRAMS SUB-TAB */}
          {activeSubTab === 'commissions' && (
            <Box className="tab-content-enter-active">
              
              {/* Compact Switcher & Action Toolbar (Maximized space, heading removed) */}
              <Paper sx={{ mb: 2.5, px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
                <Tabs 
                  value={commissionViewTab} 
                  onChange={(e, val) => setCommissionViewTab(val)}
                  indicatorColor="primary"
                  textColor="primary"
                  sx={{ minHeight: 40 }}
                >
                  <Tab label="All 18 Commissions" icon={<ChurchIcon fontSize="small" />} iconPosition="start" sx={{ textTransform: 'none', fontWeight: 700, minHeight: 40, py: 0.5 }} />
                  <Tab label="Competitions & Programs" icon={<EmojiEventsIcon fontSize="small" />} iconPosition="start" sx={{ textTransform: 'none', fontWeight: 700, minHeight: 40, py: 0.5 }} />
                </Tabs>
                {canOrganizeProgram && (
                  <Button 
                    variant="contained" 
                    size="small"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenAdd('program')}
                    sx={{ textTransform: 'none', whiteSpace: 'nowrap' }}
                  >
                    Organize Program / Competition
                  </Button>
                )}
              </Paper>

              {/* View 0: 18 Commissions Grid (Exact layout from the official photo) */}
              {commissionViewTab === 0 && (
                <Grid container spacing={2.5}>
                  {commissions.map((comm) => (
                    <Grid item xs={12} md={6} key={comm.id}>
                      <Paper 
                        elevation={0}
                        sx={{ 
                          p: 2.5, 
                          height: '100%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 2.5,
                          border: mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
                          bgcolor: mode === 'dark' ? '#1e2533' : '#fbfbf9',
                          borderRadius: 2.5,
                          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
                          }
                        }}
                      >
                        {/* Number Badge */}
                        <Typography variant="h6" sx={{ color: 'text.disabled', fontWeight: 800, width: 24, textAlign: 'center' }}>
                          {comm.order_num}
                        </Typography>

                        {/* Commission Icon Thumbnail */}
                        <Box sx={{ 
                          width: 58, 
                          height: 58, 
                          borderRadius: 2, 
                          bgcolor: mode === 'dark' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(30, 58, 138, 0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'primary.main',
                          flexShrink: 0
                        }}>
                          <ChurchIcon sx={{ fontSize: 30 }} />
                        </Box>

                        {/* Commission Title & Tagline */}
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.25, mb: 0.5 }}>
                            {comm.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.84rem', lineHeight: 1.4 }}>
                            {comm.tagline}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.disabled' }}>
                              Director: {comm.director_name || 'Chancery Appointed'}
                            </Typography>
                            {comm.programs_count > 0 && (
                              <Chip 
                                size="small" 
                                label={`${comm.programs_count} active`} 
                                color="primary" 
                                variant="outlined" 
                                sx={{ height: 20, fontSize: '0.68rem' }} 
                              />
                            )}
                          </Box>
                        </Box>

                        {/* Forward Action Icon */}
                        <IconButton 
                          size="small" 
                          onClick={() => {
                            setFilterCommissionId(comm.id);
                            setCommissionViewTab(1);
                          }}
                          sx={{ color: 'text.disabled' }}
                        >
                          →
                        </IconButton>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}

              {/* View 1: Competitions & Programs Directory */}
              {commissionViewTab === 1 && (
                <Box>
                  {/* Filters Bar */}
                  <Paper sx={{ p: 2, mb: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={4}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Filter by Commission</InputLabel>
                          <Select
                            value={filterCommissionId}
                            label="Filter by Commission"
                            onChange={e => setFilterCommissionId(e.target.value)}
                          >
                            <MenuItem value="all">All Commissions (18)</MenuItem>
                            {commissions.map(c => (
                              <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Filter by Type</InputLabel>
                          <Select
                            value={filterProgramType}
                            label="Filter by Type"
                            onChange={e => setFilterProgramType(e.target.value)}
                          >
                            <MenuItem value="all">All Types</MenuItem>
                            <MenuItem value="Competition">Competitions & Quizzes</MenuItem>
                            <MenuItem value="Program">Pastoral Programs</MenuItem>
                            <MenuItem value="Seminar">Seminars & Conferences</MenuItem>
                            <MenuItem value="Youth Camp">Youth Camps & Conventions</MenuItem>
                            <MenuItem value="Retreat">Spiritual Retreats</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={4} sx={{ textAlign: 'right' }}>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          onClick={() => { setFilterCommissionId('all'); setFilterProgramType('all'); }}
                        >
                          Reset Filters
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* Programs Grid */}
                  <Grid container spacing={3}>
                    {filteredPrograms.map(p => (
                      <Grid item xs={12} md={6} key={p.id}>
                        <Card sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                              <Box>
                                <Typography variant="caption" sx={{ color: 'secondary.main', fontWeight: 700, textTransform: 'uppercase' }}>
                                  {p.commission_name}
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.3 }}>
                                  {p.title}
                                </Typography>
                              </Box>
                              <Chip 
                                label={p.type} 
                                color={p.type === 'Competition' ? 'warning' : 'primary'} 
                                size="small" 
                                sx={{ fontWeight: 700 }}
                              />
                            </Box>

                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
                              {p.description}
                            </Typography>

                            <Divider sx={{ my: 1.5 }} />

                            <Grid container spacing={1} sx={{ mb: 2 }}>
                              <Grid item xs={6}>
                                <Typography variant="caption" color="text.secondary">Target Audience</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{p.target_audience}</Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="caption" color="text.secondary">Date & Time</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{p.start_date}</Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="caption" color="text.secondary">Venue</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{p.venue || 'Diocesan Center'}</Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="caption" color="text.secondary">Registration Deadline</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{p.registration_deadline || 'Open'}</Typography>
                              </Grid>
                            </Grid>
                          </Box>

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                            <Button 
                              size="small" 
                              variant="contained" 
                              color="primary"
                              startIcon={<HowToRegIcon />}
                              onClick={() => handleOpenRegisterParticipant(p)}
                            >
                              Register Participant
                            </Button>

                            <Stack direction="row" spacing={1}>
                              <Button 
                                size="small" 
                                variant="outlined" 
                                startIcon={<LeaderboardIcon />}
                                onClick={() => handleViewParticipants(p)}
                              >
                                View Entries ({p.participants_count || 0})
                              </Button>

                              {canOrganizeProgram && (
                                <>
                                  <IconButton onClick={() => handleOpenEdit('program', p)} size="small" color="primary">
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton onClick={() => handleDelete('program', p.id)} size="small" color="error">
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </>
                              )}
                            </Stack>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                    {filteredPrograms.length === 0 && (
                      <Grid item xs={12}>
                        <Paper sx={{ p: 6, textAlign: 'center' }}>
                          <Typography color="text.secondary">No programs or competitions match the selected filter criteria.</Typography>
                        </Paper>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}

            </Box>
          )}

          {/* 3. DIOCESES SUB-TAB */}
          {activeSubTab === 'dioceses' && isSuper && (
            <Box className="tab-content-enter-active">
              <TableContainer component={Paper}>
                <Box sx={{ px: 2, py: 1.25, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => handleOpenAdd('diocese')} sx={{ textTransform: 'none' }}>
                    Add Diocese
                  </Button>
                </Box>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Status</TableCell>
                      <TableCell>Diocese Name</TableCell>
                      <TableCell>Bishop</TableCell>
                      <TableCell>Founded Year</TableCell>
                      <TableCell>Contact Email</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dioceses.map(d => {
                      const isActive = d.id === activeDioceseId;
                      return (
                        <TableRow key={d.id} hover>
                          <TableCell>
                            <Button 
                              variant={isActive ? "contained" : "outlined"} 
                              size="small" 
                              color={isActive ? "success" : "primary"}
                              onClick={() => setActiveDioceseId(d.id)}
                            >
                              {isActive ? "Active" : "Select"}
                            </Button>
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>{d.name}</TableCell>
                          <TableCell>{d.bishop || 'Vacant'}</TableCell>
                          <TableCell>{d.founded || 'N/A'}</TableCell>
                          <TableCell>{d.email || 'N/A'}</TableCell>
                          <TableCell align="right">
                            <IconButton onClick={() => handleOpenEdit('diocese', d)} size="small" color="primary"><EditIcon fontSize="small" /></IconButton>
                            <IconButton onClick={() => handleDelete('diocese', d.id)} size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* 4. DEANERIES SUB-TAB */}
          {activeSubTab === 'deaneries' && (isSuper || isDean) && (
            <Box className="tab-content-enter-active">
              <TableContainer component={Paper}>
                {canManageDeaneries && (
                  <Box sx={{ px: 2, py: 1.25, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => handleOpenAdd('deanery')} sx={{ textTransform: 'none' }}>
                      Add Deanery
                    </Button>
                  </Box>
                )}
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Deanery Name</TableCell>
                      <TableCell>Vicar Forane (Dean)</TableCell>
                      <TableCell>Diocese</TableCell>
                      <TableCell>Description</TableCell>
                      {canManageDeaneries && <TableCell align="right">Actions</TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredDeaneries.map(d => (
                      <TableRow key={d.id} hover>
                        <TableCell sx={{ fontWeight: 700 }}>{d.name}</TableCell>
                        <TableCell>{d.dean || 'Vacant'}</TableCell>
                        <TableCell>{d.diocese_name || activeDiocese?.name || 'Simla-Chandigarh'}</TableCell>
                        <TableCell>{d.description || 'N/A'}</TableCell>
                        {canManageDeaneries && (
                          <TableCell align="right">
                            <IconButton onClick={() => handleOpenEdit('deanery', d)} size="small" color="primary"><EditIcon fontSize="small" /></IconButton>
                            <IconButton onClick={() => handleDelete('deanery', d.id)} size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* 5. PARISHES SUB-TAB */}
          {activeSubTab === 'parishes' && (
            <Box className="tab-content-enter-active">
              <TableContainer component={Paper}>
                {canManageParishes && (
                  <Box sx={{ px: 2, py: 1.25, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => handleOpenAdd('parish')} sx={{ textTransform: 'none' }}>
                      Add Parish
                    </Button>
                  </Box>
                )}
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Parish Name</TableCell>
                      <TableCell>Deanery</TableCell>
                      <TableCell>Pastor (Priest-in-charge)</TableCell>
                      <TableCell>Contact Details</TableCell>
                      <TableCell>Address</TableCell>
                      {canManageParishes && <TableCell align="right">Actions</TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredParishes.map(p => (
                      <TableRow key={p.id} hover>
                        <TableCell sx={{ fontWeight: 700 }}>{p.name}</TableCell>
                        <TableCell>{p.deanery_name || 'N/A'}</TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{p.pastor || 'Vacant'}</Typography>
                          {p.assistant_pastor && <Typography variant="caption" color="text.secondary">Asst: {p.assistant_pastor}</Typography>}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{p.email || 'N/A'}</Typography>
                          <Typography variant="caption" color="text.secondary">{p.phone || ''}</Typography>
                        </TableCell>
                        <TableCell>{p.address || 'N/A'}</TableCell>
                        {canManageParishes && (
                          <TableCell align="right">
                            <IconButton onClick={() => handleOpenEdit('parish', p)} size="small" color="primary"><EditIcon fontSize="small" /></IconButton>
                            <IconButton onClick={() => handleDelete('parish', p.id)} size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                    {filteredParishes.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                          No parishes found matching your jurisdictional scope.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* 6. MEMBERS SUB-TAB */}
          {activeSubTab === 'members' && (
            <Box className="tab-content-enter-active">
              
              {/* Merged Single Table Container with Filters & Grid Unified */}
              <TableContainer component={Paper}>
                <Box sx={{ p: 1.5, px: 2, display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'nowrap', overflowX: 'auto', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  {/* Search */}
                  <TextField
                    size="small"
                    placeholder="Search name, phone, family..."
                    value={membersSearch}
                    onChange={(e) => setMembersSearch(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ minWidth: 200, flex: 1 }}
                  />

                  {/* Parish Filter */}
                  {!isParishRole && (
                    <FormControl size="small" sx={{ minWidth: 150, width: 170, flexShrink: 0 }}>
                      <InputLabel>Parish Filter</InputLabel>
                      <Select
                        value={membersParishFilter}
                        label="Parish Filter"
                        onChange={(e) => setMembersParishFilter(e.target.value)}
                      >
                        <MenuItem value="all">All Parishes</MenuItem>
                        {filteredParishes.map(p => (
                          <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}

                  {/* Role Filter */}
                  <FormControl size="small" sx={{ minWidth: 120, width: 130, flexShrink: 0 }}>
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={membersRoleFilter}
                      label="Role"
                      onChange={(e) => setMembersRoleFilter(e.target.value)}
                    >
                      <MenuItem value="all">All Roles</MenuItem>
                      <MenuItem value="Lay people">Lay people</MenuItem>
                      <MenuItem value="Parish Priest">Parish Priest</MenuItem>
                      <MenuItem value="Dean">Dean</MenuItem>
                      <MenuItem value="Bishop">Bishop</MenuItem>
                      <MenuItem value="Sisters">Sisters</MenuItem>
                      <MenuItem value="Youth">Youth</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Sacrament Filter */}
                  <FormControl size="small" sx={{ minWidth: 130, width: 140, flexShrink: 0 }}>
                    <InputLabel>Sacrament</InputLabel>
                    <Select
                      value={membersSacramentFilter}
                      label="Sacrament"
                      onChange={(e) => setMembersSacramentFilter(e.target.value)}
                    >
                      <MenuItem value="all">All Sacraments</MenuItem>
                      <MenuItem value="baptism">Baptized</MenuItem>
                      <MenuItem value="communion">Communion</MenuItem>
                      <MenuItem value="confirmation">Confirmed</MenuItem>
                      <MenuItem value="marriage">Matrimony</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Action Buttons in same line */}
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexShrink: 0, ml: 'auto' }}>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      startIcon={<FileDownloadIcon />}
                      onClick={() => downloadFile('/api/reports/export/members/excel', 'Parishioners_Directory.xlsx')}
                      sx={{ textTransform: 'none', px: 1.25, whiteSpace: 'nowrap' }}
                    >
                      Excel
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      startIcon={<FileDownloadIcon />}
                      onClick={() => downloadFile('/api/reports/export/members/csv', 'Parishioners_Directory.csv')}
                      sx={{ textTransform: 'none', px: 1.25, whiteSpace: 'nowrap' }}
                    >
                      CSV
                    </Button>
                    {canManageMembers && (
                      <Button 
                        variant="contained" 
                        size="small" 
                        startIcon={<AddIcon />} 
                        onClick={() => handleOpenAdd('member')}
                        sx={{ textTransform: 'none', whiteSpace: 'nowrap' }}
                      >
                        Add Member
                      </Button>
                    )}
                  </Box>
                </Box>

                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Parishioner</TableCell>
                      <TableCell>Parish</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>Sacraments</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredMembers.map(m => (
                      <TableRow key={m.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar src={m.avatar_url} sx={{ width: 34, height: 34 }}>
                              {m.first_name ? m.first_name[0] : 'U'}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                {m.first_name} {m.last_name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {m.gender} • DOB: {m.dob || 'N/A'}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{m.parish_name || 'N/A'}</TableCell>
                        <TableCell>
                          <Chip size="small" label={m.role} variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{m.phone || 'N/A'}</Typography>
                          <Typography variant="caption" color="text.secondary">{m.email || ''}</Typography>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.5}>
                            {m.baptism_received === 1 && <Chip size="small" label="B" color="primary" sx={{ width: 22, height: 22, p: 0 }} title="Baptism" />}
                            {m.communion_received === 1 && <Chip size="small" label="C" color="success" sx={{ width: 22, height: 22, p: 0 }} title="Communion" />}
                            {m.confirmation_received === 1 && <Chip size="small" label="CF" color="secondary" sx={{ width: 22, height: 22, p: 0 }} title="Confirmation" />}
                            {m.marriage_received === 1 && <Chip size="small" label="M" color="warning" sx={{ width: 22, height: 22, p: 0 }} title="Marriage" />}
                          </Stack>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => { setSelectedMember(m); setProfileDrawerOpen(true); }} size="small" color="info">
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          {canManageMembers && (
                            <>
                              <IconButton onClick={() => handleOpenEdit('member', m)} size="small" color="primary">
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton onClick={() => handleDelete('member', m.id)} size="small" color="error">
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* 7. NOTICE BOARD & CIRCULARS SUB-TAB */}
          {activeSubTab === 'circulars' && (
            <Box className="tab-content-enter-active">
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2.5 }}>
                <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => handleOpenAdd('circular')} sx={{ textTransform: 'none' }}>
                  Publish Circular
                </Button>
              </Box>

              <Grid container spacing={3}>
                {circulars.map(c => (
                  <Grid item xs={12} md={6} key={c.id}>
                    <Card sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                          <Typography variant="h6" sx={{ fontWeight: 800 }}>{c.title}</Typography>
                          <Chip 
                            label={c.priority} 
                            color={c.priority === 'Urgent' ? 'error' : (c.priority === 'High' ? 'warning' : 'primary')} 
                            size="small" 
                            sx={{ fontWeight: 700 }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                          {c.content}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <Typography variant="caption" color="text.disabled">
                          Issued by {c.author} • {c.publish_date || 'Recent'}
                        </Typography>
                        <IconButton onClick={() => handleDelete('circular', c.id)} size="small" color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* 8. MASS TIMINGS & EVENTS SUB-TAB */}
          {activeSubTab === 'events' && (
            <Box className="tab-content-enter-active">
              <TableContainer component={Paper}>
                <Box sx={{ px: 2, py: 1.25, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => handleOpenAdd('event')} sx={{ textTransform: 'none' }}>
                    Schedule Event / Mass
                  </Button>
                </Box>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Event Title</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Parish</TableCell>
                      <TableCell>Date & Time</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {events.map(e => (
                      <TableRow key={e.id} hover>
                        <TableCell sx={{ fontWeight: 700 }}>{e.title}</TableCell>
                        <TableCell>
                          <Chip size="small" label={e.event_type} color="primary" variant="outlined" />
                        </TableCell>
                        <TableCell>{e.parish_name || 'All Parishes'}</TableCell>
                        <TableCell>{e.start_time} {e.end_time ? `- ${e.end_time}` : ''}</TableCell>
                        <TableCell>{e.location || 'Church Main Altar'}</TableCell>
                        <TableCell>{e.description || 'N/A'}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleDelete('event', e.id)} size="small" color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* 9. TITHES & CONTRIBUTIONS SUB-TAB */}
          {activeSubTab === 'contributions' && (
            <Box className="tab-content-enter-active">
              {/* Summary Cards */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                  <Card sx={{ p: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Total Collected</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, color: 'success.main', fontFamily: 'Georgia, serif' }}>
                      ₹ {Number(contributionsSummary?.total_amount || 0).toLocaleString('en-IN')}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card sx={{ p: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Total Receipts</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, fontFamily: 'Georgia, serif' }}>
                      {contributionsSummary?.total_count || 0}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card sx={{ p: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Average Contribution</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, fontFamily: 'Georgia, serif' }}>
                      ₹ {contributionsSummary?.total_count ? Math.round(contributionsSummary.total_amount / contributionsSummary.total_count).toLocaleString('en-IN') : 0}
                    </Typography>
                  </Card>
                </Grid>
              </Grid>

              <TableContainer component={Paper}>
                <Box sx={{ px: 2, py: 1.25, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap', gap: 1 }}>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<FileDownloadIcon />}
                    onClick={() => downloadFile('/api/reports/export/contributions/excel', 'Contributions_Ledger.xlsx')}
                    sx={{ textTransform: 'none' }}
                  >
                    Export Excel
                  </Button>
                  <Button 
                    variant="contained" 
                    size="small" 
                    startIcon={<AddIcon />} 
                    onClick={() => handleOpenAdd('contribution')}
                    sx={{ textTransform: 'none' }}
                  >
                    Record Contribution
                  </Button>
                </Box>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Receipt #</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Parishioner</TableCell>
                      <TableCell>Parish</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Method</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {contributions.map(c => (
                      <TableRow key={c.id} hover>
                        <TableCell sx={{ fontWeight: 700 }}>{c.reference_no || `#${c.id}`}</TableCell>
                        <TableCell>{c.payment_date}</TableCell>
                        <TableCell>{c.member_name || 'Anonymous'}</TableCell>
                        <TableCell>{c.parish_name || 'N/A'}</TableCell>
                        <TableCell>
                          <Chip size="small" label={c.category} variant="outlined" />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'success.main' }}>
                          ₹ {Number(c.amount).toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell>{c.payment_method}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="Download Church Receipt (PDF)">
                            <IconButton 
                              onClick={() => downloadFile(`/api/reports/receipt/${c.id}`, `Receipt_${c.reference_no || c.id}.pdf`)} 
                              size="small" 
                              color="primary"
                            >
                              <PrintIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <IconButton onClick={() => handleDelete('contribution', c.id)} size="small" color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* 10. USERS SUB-TAB */}
          {activeSubTab === 'users' && isSuper && (
            <Box className="tab-content-enter-active">
              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
                      Create New User
                    </Typography>
                    <form onSubmit={handleRegisterUserSubmit}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <TextField
                          label="Username"
                          required
                          fullWidth
                          value={userForm.username}
                          onChange={e => setUserForm({ ...userForm, username: e.target.value })}
                        />
                        <TextField
                          label="Password"
                          type="password"
                          required
                          fullWidth
                          value={userForm.password}
                          onChange={e => setUserForm({ ...userForm, password: e.target.value })}
                        />
                        <FormControl fullWidth>
                          <InputLabel>Role</InputLabel>
                          <Select
                            value={userForm.role}
                            label="Role"
                            onChange={e => setUserForm({ ...userForm, role: e.target.value })}
                          >
                            <MenuItem value="Administrator">Administrator</MenuItem>
                            <MenuItem value="Bishop">Bishop</MenuItem>
                            <MenuItem value="Dean">Dean</MenuItem>
                            <MenuItem value="Parish Priest">Parish Priest</MenuItem>
                            <MenuItem value="Sisters">Sisters</MenuItem>
                            <MenuItem value="Lay people">Lay people</MenuItem>
                            <MenuItem value="Youth">Youth</MenuItem>
                          </Select>
                        </FormControl>

                        {userForm.role === 'Dean' && (
                          <FormControl fullWidth required>
                            <InputLabel>Assigned Deanery</InputLabel>
                            <Select
                              value={userForm.deanery_id}
                              label="Assigned Deanery"
                              onChange={e => setUserForm({ ...userForm, deanery_id: e.target.value })}
                            >
                              {deaneries.map(dn => (
                                <MenuItem key={dn.id} value={dn.id}>{dn.name}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}

                        {userForm.role !== 'Dean' && userForm.role !== 'Administrator' && userForm.role !== 'Bishop' && (
                          <FormControl fullWidth required>
                            <InputLabel>Assigned Parish</InputLabel>
                            <Select
                              value={userForm.parish_id}
                              label="Assigned Parish"
                              onChange={e => setUserForm({ ...userForm, parish_id: e.target.value })}
                            >
                              {parishes.map(p => (
                                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}

                        <Button type="submit" variant="contained" fullWidth sx={{ mt: 1 }}>
                          Register User
                        </Button>
                      </Box>
                    </form>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={8}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Username</TableCell>
                          <TableCell>Role</TableCell>
                          <TableCell>Jurisdiction Scope</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.map(u => (
                          <TableRow key={u.id} hover>
                            <TableCell>#{u.id}</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>{u.username}</TableCell>
                            <TableCell>
                              <Chip 
                                size="small" 
                                label={u.role} 
                                color={u.role === 'Admin' || u.role === 'Administrator' ? 'primary' : (u.role === 'Dean' ? 'secondary' : 'default')} 
                              />
                            </TableCell>
                            <TableCell>
                              {u.deanery_id ? `Deanery #${u.deanery_id}` : (u.parish_id ? `Parish #${u.parish_id}` : 'Diocese-wide')}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* 11. PERMISSIONS SUB-TAB */}
          {activeSubTab === 'permissions' && isSuper && (
            <Box className="tab-content-enter-active">
              <TableContainer component={Paper}>
                <Box sx={{ px: 2, py: 1.25, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <FormControl size="small" sx={{ width: 200 }}>
                    <InputLabel>Select Role</InputLabel>
                    <Select
                      value={permissionsRole}
                      label="Select Role"
                      onChange={e => setPermissionsRole(e.target.value)}
                    >
                      <MenuItem value="Bishop">Bishop</MenuItem>
                      <MenuItem value="Dean">Dean</MenuItem>
                      <MenuItem value="Parish Priest">Parish Priest</MenuItem>
                      <MenuItem value="Sisters">Sisters</MenuItem>
                      <MenuItem value="Lay people">Lay people</MenuItem>
                      <MenuItem value="Youth">Youth</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Module / Page</TableCell>
                      <TableCell align="center">View</TableCell>
                      <TableCell align="center">Create</TableCell>
                      <TableCell align="center">Edit</TableCell>
                      <TableCell align="center">Delete</TableCell>
                      <TableCell align="center">Export</TableCell>
                      <TableCell align="center">Print</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rolePermissionsMatrix.map((p, idx) => (
                      <TableRow key={p.id || idx} hover>
                        <TableCell sx={{ fontWeight: 700 }}>{p.page}</TableCell>
                        <TableCell align="center"><Checkbox checked={p.can_view === 1} onChange={() => handleCheckboxChange(idx, 'can_view')} /></TableCell>
                        <TableCell align="center"><Checkbox checked={p.can_create === 1} onChange={() => handleCheckboxChange(idx, 'can_create')} /></TableCell>
                        <TableCell align="center"><Checkbox checked={p.can_edit === 1} onChange={() => handleCheckboxChange(idx, 'can_edit')} /></TableCell>
                        <TableCell align="center"><Checkbox checked={p.can_delete === 1} onChange={() => handleCheckboxChange(idx, 'can_delete')} /></TableCell>
                        <TableCell align="center"><Checkbox checked={p.can_export === 1} onChange={() => handleCheckboxChange(idx, 'can_export')} /></TableCell>
                        <TableCell align="center"><Checkbox checked={p.can_print === 1} onChange={() => handleCheckboxChange(idx, 'can_print')} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mt: 3 }}>
                <Button variant="contained" onClick={handlePermissionsSubmit}>
                  Save Permissions
                </Button>
              </Box>
            </Box>
          )}

        </Container>
      </Box>

      {/* GLOBAL DIALOG MODAL */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth={dialogType === 'member' || dialogType === 'program' ? 'md' : 'sm'}
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{editItem ? 'Edit' : 'Add New'} {dialogType[0]?.toUpperCase() + dialogType.slice(1)}</span>
          <IconButton onClick={() => setDialogOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          
          {/* Program / Competition Form */}
          {dialogType === 'program' && (
            <Grid container spacing={2} sx={{ pt: 1 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Organizing Commission</InputLabel>
                  <Select
                    value={programForm.commission_id}
                    label="Organizing Commission"
                    onChange={e => setProgramForm({ ...programForm, commission_id: e.target.value })}
                  >
                    {commissions.map(c => (
                      <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Event Type</InputLabel>
                  <Select
                    value={programForm.type}
                    label="Event Type"
                    onChange={e => setProgramForm({ ...programForm, type: e.target.value })}
                  >
                    <MenuItem value="Competition">Competition & Quiz</MenuItem>
                    <MenuItem value="Program">Pastoral Program</MenuItem>
                    <MenuItem value="Seminar">Seminar & Conference</MenuItem>
                    <MenuItem value="Youth Camp">Youth Camp & Convention</MenuItem>
                    <MenuItem value="Retreat">Spiritual Retreat</MenuItem>
                    <MenuItem value="Workshop">Skill Workshop</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Program / Competition Title" value={programForm.title} onChange={e => setProgramForm({ ...programForm, title: e.target.value })} required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Objective & Description" multiline rows={3} value={programForm.description} onChange={e => setProgramForm({ ...programForm, description: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Target Audience</InputLabel>
                  <Select
                    value={programForm.target_audience}
                    label="Target Audience"
                    onChange={e => setProgramForm({ ...programForm, target_audience: e.target.value })}
                  >
                    <MenuItem value="All">All Parishioners</MenuItem>
                    <MenuItem value="Youth">Youth (15-28 yrs)</MenuItem>
                    <MenuItem value="Children / Sunday School">Children / Sunday School</MenuItem>
                    <MenuItem value="Families">Families & Couples</MenuItem>
                    <MenuItem value="Women">Catholic Women</MenuItem>
                    <MenuItem value="Laity">Lay Leaders</MenuItem>
                    <MenuItem value="Clergy">Priests & Religious</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Start Date / Time" placeholder="e.g. 2026-10-25 10:00 AM" value={programForm.start_date} onChange={e => setProgramForm({ ...programForm, start_date: e.target.value })} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Venue / Location" value={programForm.venue} onChange={e => setProgramForm({ ...programForm, venue: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Registration Deadline" placeholder="e.g. 2026-10-18" value={programForm.registration_deadline} onChange={e => setProgramForm({ ...programForm, registration_deadline: e.target.value })} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Eligibility & Rules / Guidelines" multiline rows={2} value={programForm.guidelines} onChange={e => setProgramForm({ ...programForm, guidelines: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Coordinator / Contact Person" value={programForm.contact_person} onChange={e => setProgramForm({ ...programForm, contact_person: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Contact Phone" value={programForm.contact_phone} onChange={e => setProgramForm({ ...programForm, contact_phone: e.target.value })} />
              </Grid>
            </Grid>
          )}

          {/* Participant Register Form */}
          {dialogType === 'participant' && (
            <Grid container spacing={2} sx={{ pt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  Registering for: {selectedProgram?.title}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Parish</InputLabel>
                  <Select
                    value={participantForm.parish_id}
                    label="Parish"
                    disabled={isParishRole}
                    onChange={e => setParticipantForm({ ...participantForm, parish_id: e.target.value })}
                  >
                    {filteredParishes.map(p => (
                      <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Candidate / Team Lead Name" value={participantForm.participant_name} onChange={e => setParticipantForm({ ...participantForm, participant_name: e.target.value })} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Team / Group Name (Optional)" placeholder="e.g. Youth Choir A" value={participantForm.team_name} onChange={e => setParticipantForm({ ...participantForm, team_name: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Category" placeholder="e.g. Juniors / Seniors / Solo" value={participantForm.category} onChange={e => setParticipantForm({ ...participantForm, category: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="number" label="Age" value={participantForm.age} onChange={e => setParticipantForm({ ...participantForm, age: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Contact Phone" value={participantForm.contact_phone} onChange={e => setParticipantForm({ ...participantForm, contact_phone: e.target.value })} />
              </Grid>
            </Grid>
          )}

          {/* Award Update Modal */}
          {dialogType === 'award' && (
            <Grid container spacing={2} sx={{ pt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Award Merit & Certificate for: {editItem?.participant_name}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="number" label="Score / Marks" value={awardForm.score} onChange={e => setAwardForm({ ...awardForm, score: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Award / Rank</InputLabel>
                  <Select
                    value={awardForm.rank}
                    label="Award / Rank"
                    onChange={e => setAwardForm({ ...awardForm, rank: e.target.value })}
                  >
                    <MenuItem value="1st Prize">1st Prize (Winner)</MenuItem>
                    <MenuItem value="2nd Prize">2nd Prize (Runner-Up)</MenuItem>
                    <MenuItem value="3rd Prize">3rd Prize</MenuItem>
                    <MenuItem value="Certificate of Merit">Certificate of Merit</MenuItem>
                    <MenuItem value="Certificate of Participation">Certificate of Participation</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}

          {/* Diocese Form */}
          {dialogType === 'diocese' && (
            <Grid container spacing={2} sx={{ pt: 1 }}>
              <Grid item xs={12}><TextField fullWidth label="Diocese Name" value={dioceseForm.name} onChange={(e) => setDioceseForm({ ...dioceseForm, name: e.target.value })} required /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Bishop" value={dioceseForm.bishop} onChange={(e) => setDioceseForm({ ...dioceseForm, bishop: e.target.value })} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Founded Year" value={dioceseForm.founded} onChange={(e) => setDioceseForm({ ...dioceseForm, founded: e.target.value })} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Email" value={dioceseForm.email} onChange={(e) => setDioceseForm({ ...dioceseForm, email: e.target.value })} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Phone" value={dioceseForm.phone} onChange={(e) => setDioceseForm({ ...dioceseForm, phone: e.target.value })} /></Grid>
              <Grid item xs={12}><TextField fullWidth label="Office Address" value={dioceseForm.address} onChange={(e) => setDioceseForm({ ...dioceseForm, address: e.target.value })} multiline rows={2} /></Grid>
            </Grid>
          )}

          {/* Deanery Form */}
          {dialogType === 'deanery' && (
            <Grid container spacing={2} sx={{ pt: 1 }}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Parent Diocese</InputLabel>
                  <Select value={deaneryForm.diocese_id} label="Parent Diocese" onChange={(e) => setDeaneryForm({ ...deaneryForm, diocese_id: e.target.value })}>
                    {dioceses.map(d => (<MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}><TextField fullWidth label="Deanery Name" value={deaneryForm.name} onChange={(e) => setDeaneryForm({ ...deaneryForm, name: e.target.value })} required /></Grid>
              <Grid item xs={12}><TextField fullWidth label="Vicar Forane (Dean)" value={deaneryForm.dean} onChange={(e) => setDeaneryForm({ ...deaneryForm, dean: e.target.value })} /></Grid>
              <Grid item xs={12}><TextField fullWidth label="Description" value={deaneryForm.description} onChange={(e) => setDeaneryForm({ ...deaneryForm, description: e.target.value })} multiline rows={2} /></Grid>
            </Grid>
          )}

          {/* Parish Form */}
          {dialogType === 'parish' && (
            <Grid container spacing={2} sx={{ pt: 1 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Deanery</InputLabel>
                  <Select value={parishForm.deanery_id} label="Deanery" onChange={(e) => setParishForm({ ...parishForm, deanery_id: e.target.value })}>
                    {filteredDeaneries.map(dn => (<MenuItem key={dn.id} value={dn.id}>{dn.name}</MenuItem>))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Parish Name" value={parishForm.name} onChange={(e) => setParishForm({ ...parishForm, name: e.target.value })} required /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Parish Priest (Pastor)" value={parishForm.pastor} onChange={(e) => setParishForm({ ...parishForm, pastor: e.target.value })} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Assistant Pastor" value={parishForm.assistant_pastor} onChange={(e) => setParishForm({ ...parishForm, assistant_pastor: e.target.value })} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Parish Email" value={parishForm.email} onChange={(e) => setParishForm({ ...parishForm, email: e.target.value })} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Parish Phone" value={parishForm.phone} onChange={(e) => setParishForm({ ...parishForm, phone: e.target.value })} /></Grid>
              <Grid item xs={12}><TextField fullWidth label="Parish Address" value={parishForm.address} onChange={(e) => setParishForm({ ...parishForm, address: e.target.value })} multiline rows={2} /></Grid>
            </Grid>
          )}

          {/* Member Form */}
          {dialogType === 'member' && (
            <Grid container spacing={2} sx={{ pt: 1 }}>
              <Grid item xs={12}><AvatarUploader value={memberForm.avatar_url} onChange={(url) => setMemberForm({ ...memberForm, avatar_url: url })} /></Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Parish Registry</InputLabel>
                  <Select value={memberForm.parish_id} label="Parish Registry" disabled={isParishRole} onChange={(e) => setMemberForm({ ...memberForm, parish_id: e.target.value })}>
                    {filteredParishes.map(p => (<MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select value={memberForm.role} label="Role" onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}>
                    <MenuItem value="Lay people">Lay people</MenuItem>
                    <MenuItem value="Parish Priest">Parish Priest</MenuItem>
                    <MenuItem value="Dean">Dean</MenuItem>
                    <MenuItem value="Bishop">Bishop</MenuItem>
                    <MenuItem value="Sisters">Sisters</MenuItem>
                    <MenuItem value="Youth">Youth</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select value={memberForm.gender} label="Gender" onChange={(e) => setMemberForm({ ...memberForm, gender: e.target.value })}>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="First Name" value={memberForm.first_name} onChange={(e) => setMemberForm({ ...memberForm, first_name: e.target.value })} required /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Last Name" value={memberForm.last_name} onChange={(e) => setMemberForm({ ...memberForm, last_name: e.target.value })} required /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth type="date" label="Date of Birth" InputLabelProps={{ shrink: true }} value={memberForm.dob} onChange={(e) => setMemberForm({ ...memberForm, dob: e.target.value })} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Phone" value={memberForm.phone} onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })} /></Grid>
              <Grid item xs={12}><TextField fullWidth label="Email" value={memberForm.email} onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })} /></Grid>
              <Grid item xs={12}><TextField fullWidth label="Residential Address" value={memberForm.address} onChange={(e) => setMemberForm({ ...memberForm, address: e.target.value })} /></Grid>
            </Grid>
          )}

          {/* Circular Form */}
          {dialogType === 'circular' && (
            <Grid container spacing={2} sx={{ pt: 1 }}>
              <Grid item xs={12}><TextField fullWidth label="Title / Subject" value={circularForm.title} onChange={e => setCircularForm({ ...circularForm, title: e.target.value })} required /></Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select value={circularForm.priority} label="Priority" onChange={e => setCircularForm({ ...circularForm, priority: e.target.value })}>
                    <MenuItem value="Normal">Normal</MenuItem><MenuItem value="High">High</MenuItem><MenuItem value="Urgent">Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Issuing Authority" value={circularForm.author} onChange={e => setCircularForm({ ...circularForm, author: e.target.value })} /></Grid>
              <Grid item xs={12}><TextField fullWidth label="Circular Text & Announcement" multiline rows={5} value={circularForm.content} onChange={e => setCircularForm({ ...circularForm, content: e.target.value })} required /></Grid>
            </Grid>
          )}

          {/* Event Form */}
          {dialogType === 'event' && (
            <Grid container spacing={2} sx={{ pt: 1 }}>
              <Grid item xs={12}><TextField fullWidth label="Event / Mass Title" value={eventForm.title} onChange={e => setEventForm({ ...eventForm, title: e.target.value })} required /></Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Event Type</InputLabel>
                  <Select value={eventForm.event_type} label="Event Type" onChange={e => setEventForm({ ...eventForm, event_type: e.target.value })}>
                    <MenuItem value="Mass">Holy Mass</MenuItem><MenuItem value="Feast">Patronal Feast</MenuItem><MenuItem value="Adoration">Eucharistic Adoration</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Parish</InputLabel>
                  <Select value={eventForm.parish_id} label="Parish" disabled={isParishRole} onChange={e => setEventForm({ ...eventForm, parish_id: e.target.value })}>
                    {filteredParishes.map(p => (<MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Start Time (e.g. 2026-10-04 08:00 AM)" value={eventForm.start_time} onChange={e => setEventForm({ ...eventForm, start_time: e.target.value })} required /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Location (e.g. Main Church)" value={eventForm.location} onChange={e => setEventForm({ ...eventForm, location: e.target.value })} /></Grid>
              <Grid item xs={12}><TextField fullWidth label="Description / Liturgical Celebrant" multiline rows={3} value={eventForm.description} onChange={e => setEventForm({ ...eventForm, description: e.target.value })} /></Grid>
            </Grid>
          )}

          {/* Contribution Form */}
          {dialogType === 'contribution' && (
            <Grid container spacing={2} sx={{ pt: 1 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Parish</InputLabel>
                  <Select value={contributionForm.parish_id} label="Parish" disabled={isParishRole} onChange={e => setContributionForm({ ...contributionForm, parish_id: e.target.value })}>
                    {filteredParishes.map(p => (<MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Parishioner (Optional)</InputLabel>
                  <Select value={contributionForm.member_id} label="Parishioner (Optional)" onChange={e => setContributionForm({ ...contributionForm, member_id: e.target.value })}>
                    <MenuItem value="">Anonymous / General</MenuItem>
                    {filteredMembers.map(m => (<MenuItem key={m.id} value={m.id}>{m.first_name} {m.last_name}</MenuItem>))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select value={contributionForm.category} label="Category" onChange={e => setContributionForm({ ...contributionForm, category: e.target.value })}>
                    <MenuItem value="Sunday Tithe">Sunday Tithe</MenuItem><MenuItem value="Monthly Offering">Monthly Offering</MenuItem><MenuItem value="Mission Sunday">Mission Sunday</MenuItem><MenuItem value="Church Building Fund">Church Building Fund</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth type="number" label="Amount (₹)" value={contributionForm.amount} onChange={e => setContributionForm({ ...contributionForm, amount: e.target.value })} required /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Reference / Receipt #" value={contributionForm.reference_no} onChange={e => setContributionForm({ ...contributionForm, reference_no: e.target.value })} /></Grid>
            </Grid>
          )}

        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      {/* VIEW PARTICIPANTS MODAL & CERTIFICATE ISSUANCE */}
      <Dialog 
        open={participantsModalOpen} 
        onClose={() => setParticipantsModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Entries & Leaderboard: {selectedProgram?.title}</Typography>
            <Typography variant="caption" color="text.secondary">
              Award merit, enter scores, and download official diocesan certificates
            </Typography>
          </Box>
          <IconButton onClick={() => setParticipantsModalOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Participant / Team</TableCell>
                  <TableCell>Parish</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell>Award / Rank</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {programParticipants.map(part => (
                  <TableRow key={part.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{part.participant_name}</Typography>
                      {part.team_name && <Typography variant="caption" color="text.secondary">Team: {part.team_name}</Typography>}
                    </TableCell>
                    <TableCell>{part.parish_name || 'Parish'}</TableCell>
                    <TableCell><Chip size="small" label={part.category || 'General'} variant="outlined" /></TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{part.score != null ? `${part.score} pts` : '—'}</TableCell>
                    <TableCell>
                      <Chip 
                        size="small" 
                        label={part.rank || 'Participant'} 
                        color={part.rank?.includes('1st') ? 'warning' : (part.rank?.includes('2nd') ? 'secondary' : (part.rank?.includes('3rd') ? 'info' : 'default'))} 
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button 
                          size="small" 
                          variant="outlined" 
                          onClick={() => handleOpenAwardModal(part)}
                        >
                          Score / Award
                        </Button>
                        <Tooltip title="Download Official Certificate (PDF)">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => downloadFile(`/api/reports/program-certificate/${part.id}`, `${part.participant_name}_Certificate.pdf`)}
                          >
                            <PrintIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <IconButton size="small" color="error" onClick={() => handleDelete('participant', part.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {programParticipants.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No participants registered for this event yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setParticipantsModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* MEMBER PROFILE DRAWER (WITH SACRAMENTAL CERTIFICATES) */}
      <Drawer
        anchor="right"
        open={profileDrawerOpen}
        onClose={() => setProfileDrawerOpen(false)}
        sx={{
          [`& .MuiDrawer-paper`]: { width: { xs: '100%', sm: 480 }, p: 3, boxSizing: 'border-box' }
        }}
      >
        {selectedMember && (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Member Profile</Typography>
              <IconButton onClick={() => setProfileDrawerOpen(false)}><CloseIcon /></IconButton>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar src={selectedMember.avatar_url} sx={{ width: 80, height: 80, mb: 1.5 }}>
                {selectedMember.first_name ? selectedMember.first_name[0] : 'U'}
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {selectedMember.first_name} {selectedMember.last_name}
              </Typography>
              <Chip label={selectedMember.role} color="secondary" size="small" sx={{ mt: 1 }} />
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 800, display: 'block', mb: 1 }}>
                Parish & Contact Details
              </Typography>
              <Grid container spacing={1.5}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Parish</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedMember.parish_name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Gender</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedMember.gender}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Date of Birth</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedMember.dob || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Phone</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedMember.phone || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Address</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedMember.address || 'N/A'}</Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 800, display: 'block', mb: 1.5 }}>
                Sacramental Registry & Certificates
              </Typography>
              
              {[
                { key: 'baptism', label: 'Sacrament of Baptism', certType: 'baptism' },
                { key: 'communion', label: 'First Holy Communion', certType: 'communion' },
                { key: 'confirmation', label: 'Sacrament of Confirmation', certType: 'confirmation' },
                { key: 'marriage', label: 'Holy Matrimony', certType: 'marriage' },
              ].map(sac => {
                const received = selectedMember[`${sac.key}_received`] === 1;
                return (
                  <Paper key={sac.key} sx={{ p: 2, mb: 1.5, border: '1px solid rgba(255,255,255,0.06)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: received ? 'text.primary' : 'text.disabled' }}>
                          {sac.label}
                        </Typography>
                        {received ? (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.3 }}>
                            Received {selectedMember[`${sac.key}_date`] ? `on ${selectedMember[`${sac.key}_date`]}` : ''} {selectedMember[`${sac.key}_parish`] ? `at ${selectedMember[`${sac.key}_parish`]}` : ''}
                          </Typography>
                        ) : (
                          <Typography variant="caption" color="text.disabled">Not recorded</Typography>
                        )}
                      </Box>
                      {received && (
                        <Button 
                          size="small" 
                          variant="outlined" 
                          startIcon={<PrintIcon />}
                          onClick={() => downloadFile(`/api/reports/certificate/${sac.certType}/${selectedMember.id}`, `${selectedMember.first_name}_${selectedMember.last_name}_${sac.certType}_Certificate.pdf`)}
                          sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                        >
                          Certificate
                        </Button>
                      )}
                    </Box>
                  </Paper>
                );
              })}
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              {canManageMembers && (
                <>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    startIcon={<EditIcon />} 
                    onClick={() => handleOpenEdit('member', selectedMember)}
                  >
                    Edit Profile
                  </Button>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    color="error" 
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete('member', selectedMember.id)}
                  >
                    Delete Record
                  </Button>
                </>
              )}
            </Box>
          </Box>
        )}
      </Drawer>

      {/* Snackbar alerts */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={() => setToastOpen(false)} severity={toastSeverity} sx={{ width: '100%' }} variant="filled">
          {toastMessage}
        </Alert>
      </Snackbar>

      {/* Confirmation Modal */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle sx={{ fontWeight: 800 }}>{confirmTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmMessage}</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setConfirmOpen(false);
              if (onConfirmCallback) onConfirmCallback();
            }}
            color="error"
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
