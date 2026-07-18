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
  LinearProgress
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

const drawerWidth = 260;

export default function DioceseErpIndex() {
  const { mode, toggleThemeMode } = useContext(ThemeModeContext);
  const [drawerOpen, setDrawerOpen] = useState(true);
  
  // Auth Session States
  const [session, setSession] = useState(null);
  const [users, setUsers] = useState([]);
  const [userForm, setUserForm] = useState({ username: '', password: '', role: 'Administrator' });
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  
  // Dynamic Permissions States
  const [userPermissions, setUserPermissions] = useState([]);
  const [permissionsRole, setPermissionsRole] = useState('Bishop');
  const [permissionsType, setPermissionsType] = useState('all');
  const [permissionsSearch, setPermissionsSearch] = useState('');
  const [rolePermissionsMatrix, setRolePermissionsMatrix] = useState([]);
  
  // Diocese selection hierarchy
  const [activeDioceseId, setActiveDioceseId] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('dashboard'); // 'dashboard', 'dioceses', 'deaneries', 'parishes', 'members', 'users'
  const [homeMenuOpen, setHomeMenuOpen] = useState(true);
  
  // Data States
  const [dioceses, setDioceses] = useState([]);
  const [deaneries, setDeaneries] = useState([]);
  const [parishes, setParishes] = useState([]);
  const [members, setMembers] = useState([]);
  
  // Member filters
  const [membersSearch, setMembersSearch] = useState('');
  const [membersParishFilter, setMembersParishFilter] = useState('all');
  const [membersRoleFilter, setMembersRoleFilter] = useState('all');
  const [membersSacramentFilter, setMembersSacramentFilter] = useState('all');

  // Modal states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(''); // 'diocese', 'deanery', 'parish', 'member'
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
    parish_id: '', first_name: '', last_name: '', gender: 'Male', dob: '', email: '', phone: '', address: '', role: 'Laity',
    baptism_received: false, baptism_date: '', baptism_parish: '',
    communion_received: false, communion_date: '', communion_parish: '',
    confirmation_received: false, confirmation_date: '', confirmation_parish: '',
    marriage_received: false, marriage_date: '', marriage_parish: '',
    holy_orders_received: false, holy_orders_date: '', holy_orders_parish: ''
  });

  const authenticatedFetch = async (url, options = {}) => {
    const savedSession = localStorage.getItem('diocese_erp_session');
    if (!savedSession) return fetch(url, options);
    
    try {
      const parsed = JSON.parse(savedSession);
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
        'Authorization': `Bearer ${parsed.token}`
      };
      return fetch(url, { ...options, headers });
    } catch (e) {
      return fetch(url, options);
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
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('diocese_erp_session', JSON.stringify(data));
        setSession(data);
        showToast('Logged in successfully!', 'success');
      } else {
        const err = await res.json();
        setLoginError(err.detail || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setLoginError('Could not connect to the authentication server.');
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
      const res = await authenticatedFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userForm)
      });
      if (res.ok) {
        showToast('User created successfully!', 'success');
        setUserForm({ username: '', password: '', role: 'Administrator' });
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

  const fetchData = async () => {
    try {
      const diocesesRes = await authenticatedFetch('/api/dioceses');
      if (diocesesRes.ok) {
        const diocesesData = await diocesesRes.json();
        setDioceses(diocesesData);
        // Default to first diocese if none is active
        if (diocesesData.length > 0 && !activeDioceseId) {
          setActiveDioceseId(diocesesData[0].id);
        }
      }
      
      const deaneriesRes = await authenticatedFetch('/api/deaneries');
      if (deaneriesRes.ok) setDeaneries(await deaneriesRes.json());
      
      const parishesRes = await authenticatedFetch('/api/parishes');
      if (parishesRes.ok) setParishes(await parishesRes.json());
      
      const membersRes = await authenticatedFetch('/api/members');
      if (membersRes.ok) setMembers(await membersRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
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
      fetchData();
      fetchUsers();
      fetchUserPermissions();
    }
  }, [activeDioceseId, session]);

  useEffect(() => {
    if (session) {
      fetchRolePermissionsMatrix(permissionsRole);
    }
  }, [permissionsRole, session]);

  // Retrieve active diocese object
  const activeDiocese = dioceses.find(d => d.id === activeDioceseId);

  // Role permissions helpers
  const userRole = (session?.user?.role || session?.role || '').toLowerCase();
  const isSuper = userRole === 'admin' || userRole === 'administrator';

  const hasPermission = (pageName, actionName) => {
    if (isSuper) return true;
    const perm = userPermissions.find(p => p.page.toLowerCase() === pageName.toLowerCase());
    if (!perm) return false;
    return perm[`can_${actionName}`] === 1;
  };

  const canManageDiocese = hasPermission("Diocese", "create");
  const canManageDeaneries = hasPermission("Deaneries", "create");
  const canManageParishes = hasPermission("Parishes", "create");
  const canManageMembers = hasPermission("Parishioners", "create");

  const canViewDiocese = hasPermission("Diocese", "view");
  const canViewDeaneries = hasPermission("Deaneries", "view");
  const canViewUsers = hasPermission("Users", "view");
  const canViewPermissions = isSuper;

  // Filter lists based on selected Diocese
  const filteredDeaneries = deaneries.filter(d => d.diocese_id === activeDioceseId);
  const filteredParishes = parishes.filter(p => p.diocese_id === activeDioceseId);
  const filteredMembers = members.filter(m => {
    // Member's parish must belong to the active diocese
    const parish = parishes.find(p => p.id === m.parish_id);
    if (!parish || parish.diocese_id !== activeDioceseId) return false;

    const matchesSearch = 
      m.first_name.toLowerCase().includes(membersSearch.toLowerCase()) ||
      m.last_name.toLowerCase().includes(membersSearch.toLowerCase()) ||
      (m.email && m.email.toLowerCase().includes(membersSearch.toLowerCase())) ||
      (m.phone && m.phone.includes(membersSearch));
    
    const matchesParish = membersParishFilter === 'all' || m.parish_id === membersParishFilter;
    const matchesRole = membersRoleFilter === 'all' || m.role === membersRoleFilter;
    
    let matchesSacrament = true;
    if (membersSacramentFilter === 'baptism') matchesSacrament = m.baptism_received === 1;
    else if (membersSacramentFilter === 'communion') matchesSacrament = m.communion_received === 1;
    else if (membersSacramentFilter === 'confirmation') matchesSacrament = m.confirmation_received === 1;
    else if (membersSacramentFilter === 'marriage') matchesSacrament = m.marriage_received === 1;
    else if (membersSacramentFilter === 'holy_orders') matchesSacrament = m.holy_orders_received === 1;

    return matchesSearch && matchesParish && matchesRole && matchesSacrament;
  });

  // Calculate stats for active diocese
  const totalUsersCount = filteredMembers.length;
  
  // Parishioners (Role: Laity) gender breakdown
  const parishionersList = filteredMembers.filter(m => m.role === 'Laity');
  const parishionersCount = parishionersList.length;
  const maleParishioners = parishionersList.filter(m => m.gender === 'Male').length;
  const femaleParishioners = parishionersList.filter(m => m.gender === 'Female').length;

  // Clergy & Staff (Role !== Laity) gender breakdown
  const staffList = filteredMembers.filter(m => m.role !== 'Laity');
  const staffCount = staffList.length;
  const maleStaff = staffList.filter(m => m.gender === 'Male').length;
  const femaleStaff = staffList.filter(m => m.gender === 'Female').length;

  // Sacraments count
  const sacramentCounts = {
    baptism: filteredMembers.filter(m => m.baptism_received === 1).length,
    communion: filteredMembers.filter(m => m.communion_received === 1).length,
    confirmation: filteredMembers.filter(m => m.confirmation_received === 1).length,
    marriage: filteredMembers.filter(m => m.marriage_received === 1).length,
    holy_orders: filteredMembers.filter(m => m.holy_orders_received === 1).length,
  };
  const totalSacraments = sacramentCounts.baptism + sacramentCounts.communion + sacramentCounts.confirmation + sacramentCounts.marriage + sacramentCounts.holy_orders;

  // Get current date formatted
  const getTodayFormatted = () => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return new Date().toLocaleDateString('en-IN', options);
  };

  // Birthday logic
  const checkBirthdayToday = (dobStr) => {
    if (!dobStr) return false;
    const dob = new Date(dobStr);
    const today = new Date();
    return dob.getDate() === today.getDate() && dob.getMonth() === today.getMonth();
  };

  const staffBirthdays = staffList.filter(m => checkBirthdayToday(m.dob));
  const parishionerBirthdays = parishionersList.filter(m => checkBirthdayToday(m.dob));

  // Dialog Opens
  const handleOpenAdd = (type) => {
    setDialogType(type);
    setEditItem(null);
    if (type === 'diocese') {
      setDioceseForm({ name: '', bishop: '', founded: '', email: '', phone: '', address: '' });
    } else if (type === 'deanery') {
      setDeaneryForm({ diocese_id: activeDioceseId, name: '', dean: '', description: '' });
    } else if (type === 'parish') {
      const activeDeanery = filteredDeaneries[0]?.id || '';
      setParishForm({ 
        diocese_id: activeDioceseId, 
        deanery_id: activeDeanery, 
        name: '', pastor: '', assistant_pastor: '', address: '', phone: '', email: '' 
      });
    } else if (type === 'member') {
      setMemberForm({
        parish_id: filteredParishes[0]?.id || '', first_name: '', last_name: '', gender: 'Male', dob: '', email: '', phone: '', address: '', role: 'Laity',
        baptism_received: false, baptism_date: '', baptism_parish: '',
        communion_received: false, communion_date: '', communion_parish: '',
        confirmation_received: false, confirmation_date: '', confirmation_parish: '',
        marriage_received: false, marriage_date: '', marriage_parish: '',
        holy_orders_received: false, holy_orders_date: '', holy_orders_parish: ''
      });
    }
    setDialogOpen(true);
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
        role: item.role || 'Laity',
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
    }
    setDialogOpen(true);
  };

  // Form submit handler
  const handleSave = async () => {
    const getPluralType = (type) => {
      if (type === 'deanery') return 'deaneries';
      return type + 's';
    };
    let url = `/api/${getPluralType(dialogType)}`;
    let method = 'POST';
    let body = {};

    if (dialogType === 'diocese') body = dioceseForm;
    else if (dialogType === 'deanery') body = deaneryForm;
    else if (dialogType === 'parish') body = parishForm;
    else if (dialogType === 'member') {
      body = {
        ...memberForm,
        baptism_received: !!memberForm.baptism_received,
        communion_received: !!memberForm.communion_received,
        confirmation_received: !!memberForm.confirmation_received,
        marriage_received: !!memberForm.marriage_received,
        holy_orders_received: !!memberForm.holy_orders_received
      };
    }

    if (editItem) {
      url += `/${editItem.id}`;
      method = 'PUT';
    }

    try {
      const res = await authenticatedFetch(url, {
        method,
        body: JSON.stringify(body)
      });
      if (res.ok) {
        setDialogOpen(false);
        showToast(`${dialogType[0].toUpperCase() + dialogType.slice(1)} saved successfully`, 'success');
        fetchData();
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
    const getPluralType = (t) => {
      if (t === 'deanery') return 'deaneries';
      return t + 's';
    };
    const capitalized = type[0].toUpperCase() + type.slice(1);
    askConfirmation(
      `Confirm Deletion`,
      `Are you sure you want to permanently delete this ${type}? This action cannot be undone.`,
      async () => {
        try {
          const res = await authenticatedFetch(`/api/${getPluralType(type)}/${id}`, { method: 'DELETE' });
          if (res.ok) {
            showToast(`${capitalized} deleted successfully`, 'success');
            fetchData();
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

  if (!session) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        bgcolor: mode === 'dark' ? '#0a0e1a' : '#f0f2f5',
        backgroundImage: mode === 'dark' 
          ? 'radial-gradient(at 0% 0%, hsla(243, 98%, 72%, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, hsla(263, 98%, 72%, 0.15) 0px, transparent 50%)'
          : 'radial-gradient(at 0% 0%, hsla(243, 98%, 72%, 0.05) 0px, transparent 50%), radial-gradient(at 100% 100%, hsla(263, 98%, 72%, 0.05) 0px, transparent 50%)',
        p: 2
      }}>
        <Paper sx={{ 
          p: 4.5, 
          width: '100%', 
          maxWidth: 420, 
          borderRadius: '16px', 
          boxShadow: mode === 'dark' ? '0 10px 40px rgba(0,0,0,0.5)' : '0 10px 40px rgba(99, 102, 241, 0.05)',
          border: mode === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(99, 102, 241, 0.08)',
          backdropFilter: 'blur(20px)'
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Box sx={{ 
              width: 56, 
              height: 56, 
              borderRadius: '12px', 
              bgcolor: 'primary.main', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)',
              mb: 2
            }}>
              <ChurchIcon sx={{ color: '#fff', fontSize: 32 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.5px', color: 'text.primary' }}>
              Diocese ERP
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Sign in to manage your diocese resources
            </Typography>
          </Box>

          {loginError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
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
              />
              <TextField
                label="Password"
                type="password"
                required
                fullWidth
                value={loginForm.password}
                onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
              />
              <Button type="submit" variant="contained" size="large" fullWidth sx={{ py: 1.5, mt: 1, fontWeight: 700 }}>
                Sign In
              </Button>
            </Box>
          </form>

          {/* Simple toggle for dark/light mode on login screen */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <IconButton onClick={toggleThemeMode} color="inherit">
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default', width: '100%' }}>
      
      {/* Top Header Bar */}
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
            <Typography variant="h5" noWrap sx={{ fontWeight: 800, color: 'primary.light', display: 'flex', alignItems: 'center', gap: 1 }}>
              ⛪ Diocese ERP
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {session && (
              <Box sx={{ 
                px: 2, 
                py: 0.5, 
                borderRadius: '20px', 
                bgcolor: 'rgba(99, 102, 241, 0.12)', 
                border: '1px solid rgba(99, 102, 241, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {session?.user?.username || session?.username} ({session?.user?.role || session?.role})
                </Typography>
              </Box>
            )}
            
            {/* Light/Dark mode toggle */}
            <Tooltip title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              <IconButton onClick={toggleThemeMode} color="inherit">
                {mode === 'dark' ? <LightModeIcon sx={{ color: 'warning.light' }} /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar navigation */}
      <Drawer
        variant="persistent"
        open={drawerOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', borderRight: 'none', boxShadow: '5px 0 30px rgba(0,0,0,0.5)' },
        }}
      >
        <Toolbar />
        


        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List sx={{ px: 1 }}>
            {[
              { text: 'Home', icon: <DashboardIcon />, id: 'dashboard' },
              ...(canViewDiocese ? [{ text: 'Diocese', icon: <RoomIcon />, id: 'dioceses' }] : []),
              ...(canViewDeaneries ? [{ text: 'Deaneries (Vicariates)', icon: <AccountBalanceIcon />, id: 'deaneries' }] : []),
              { text: 'Parishes Directory', icon: <ChurchIcon />, id: 'parishes' },
              { text: 'Parishioners (Members)', icon: <PeopleIcon />, id: 'members' },
              ...(canViewUsers ? [{ text: 'Users Registry', icon: <PeopleIcon />, id: 'users' }] : []),
              ...(canViewPermissions ? [{ text: 'Permissions Settings', icon: <LockIcon />, id: 'permissions' }] : []),
            ].map((item) => (
              <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton 
                  selected={activeSubTab === item.id}
                  onClick={() => setActiveSubTab(item.id)}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}

            <Divider sx={{ my: 2, opacity: 0.1 }} />

            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <CloseIcon sx={{ color: 'error.main' }} />
                </ListItemIcon>
                <ListItemText primary="Logout" primaryTypographyProps={{ color: 'error.main', fontWeight: 700 }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Workspace panel */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 4, 
          mt: 8, 
          width: drawerOpen ? `calc(100% - ${drawerWidth}px)` : '100%',
          transition: 'width 0.2s ease, margin-left 0.2s ease',
        }}
      >
        <Container maxWidth="xl" sx={{ mt: 1 }}>
          


          {activeDiocese && (
            <Box>
              
              {/* 1. DASHBOARD SUB-TAB */}
              {activeSubTab === 'dashboard' && (
                <Box className="tab-content-enter-active" sx={{ pt: 1 }}>
                  
                  {/* Headers */}
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 500 }}>
                    Welcome Back, Admin
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 4, fontFamily: '"Georgia", serif' }}>
                    Dashboard
                  </Typography>

                  <Grid container spacing={3}>
                    
                    {/* --- ROW 1 --- */}

                    {/* Card 1: Total Deaneries */}
                    <Grid item xs={12} md={4}>
                      <Card sx={{ height: 140, p: 3.5, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <AccountBalanceIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                            Total Deaneries
                          </Typography>
                        </Box>
                        <Box sx={{ mt: 1 }}>
                          <div className="serif-stat-number">{filteredDeaneries.length}</div>
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                            Active vicariates
                          </Typography>
                        </Box>
                        <AccountBalanceIcon sx={{ position: 'absolute', right: 16, bottom: 16, fontSize: '80px !important', color: mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', pointerEvents: 'none' }} />
                      </Card>
                    </Grid>

                    {/* Card 2: Total Parishes */}
                    <Grid item xs={12} md={4}>
                      <Card sx={{ height: 140, p: 3.5, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <ChurchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                            Total Parishes
                          </Typography>
                        </Box>
                        <Box sx={{ mt: 1 }}>
                          <div className="serif-stat-number">{filteredParishes.length}</div>
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                            Registered parishes
                          </Typography>
                        </Box>
                        <ChurchIcon sx={{ position: 'absolute', right: 16, bottom: 16, fontSize: '80px !important', color: mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', pointerEvents: 'none' }} />
                      </Card>
                    </Grid>

                    {/* Card 3: User Count */}
                    <Grid item xs={12} md={4}>
                      <Card sx={{ height: 140, p: 3.5, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <PeopleIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                            User Count
                          </Typography>
                        </Box>
                        <Box sx={{ mt: 1 }}>
                          <div className="serif-stat-number">{totalUsersCount}</div>
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                            Total active users
                          </Typography>
                        </Box>
                        <PeopleIcon sx={{ position: 'absolute', right: 16, bottom: 16, fontSize: '80px !important', color: mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', pointerEvents: 'none' }} />
                      </Card>
                    </Grid>

                    {/* --- ROW 2 --- */}

                    {/* Card 4: Parishioners */}
                    <Grid item xs={12} md={4}>
                      <Card sx={{ height: 140, p: 3, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                            Parishioners
                          </Typography>
                          <Typography variant="caption" color="secondary.main" sx={{ fontWeight: 800 }}>
                            Total: {parishionersCount}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 4, mt: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: mode === 'dark' ? 'rgba(56, 189, 248, 0.12)' : 'rgba(71, 85, 105, 0.05)', color: mode === 'dark' ? '#38bdf8' : '#475569' }}>
                              <ManIcon sx={{ fontSize: 18 }} />
                            </Avatar>
                            <Box>
                              <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', fontWeight: 800 }}>{maleParishioners}</div>
                              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '9px', fontWeight: 700 }}>Male</Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: mode === 'dark' ? 'rgba(244, 63, 94, 0.12)' : 'rgba(244, 63, 94, 0.06)', color: '#f43f5e' }}>
                              <WomanIcon sx={{ fontSize: 18 }} />
                            </Avatar>
                            <Box>
                              <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', fontWeight: 800 }}>{femaleParishioners}</div>
                              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '9px', fontWeight: 700 }}>Female</Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Card>
                    </Grid>

                    {/* Card 5: Clergy & Staff */}
                    <Grid item xs={12} md={4}>
                      <Card sx={{ height: 140, p: 3, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                            Clergy & Staff
                          </Typography>
                          <Typography variant="caption" color="secondary.main" sx={{ fontWeight: 800 }}>
                            Total: {staffCount}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 4, mt: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: mode === 'dark' ? 'rgba(56, 189, 248, 0.12)' : 'rgba(71, 85, 105, 0.05)', color: mode === 'dark' ? '#38bdf8' : '#475569' }}>
                              <ManIcon sx={{ fontSize: 18 }} />
                            </Avatar>
                            <Box>
                              <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', fontWeight: 800 }}>{maleStaff}</div>
                              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '9px', fontWeight: 700 }}>Male</Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: mode === 'dark' ? 'rgba(244, 63, 94, 0.12)' : 'rgba(244, 63, 94, 0.06)', color: '#f43f5e' }}>
                              <WomanIcon sx={{ fontSize: 18 }} />
                            </Avatar>
                            <Box>
                              <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', fontWeight: 800 }}>{femaleStaff}</div>
                              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '9px', fontWeight: 700 }}>Female</Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Card>
                    </Grid>

                    {/* Card 6: Sacrament Records */}
                    <Grid item xs={12} md={4}>
                      <Card sx={{ height: 140, p: 3.5, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <BookIcon sx={{ color: 'secondary.main', fontSize: 20 }} />
                          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                            Sacrament Records
                          </Typography>
                        </Box>
                        <Box sx={{ mt: 1 }}>
                          <div className="serif-stat-number">{totalSacraments}</div>
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                            Total milestones registered
                          </Typography>
                        </Box>
                        <BookIcon sx={{ position: 'absolute', right: 16, bottom: 16, fontSize: '80px !important', color: mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', pointerEvents: 'none' }} />
                      </Card>
                    </Grid>

                    {/* --- ROW 3 --- */}

                    {/* Card 7: Mass Attendance */}
                    <Grid item xs={12} md={4}>
                      <Card sx={{ height: 280, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.85rem', mb: 1 }}>
                          Mass Attendance
                        </Typography>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexGrow: 1, mt: 1 }}>
                          {/* Gauge 1 */}
                          <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                              <CircularProgress variant="determinate" value={0} size={70} thickness={5} sx={{ color: mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }} />
                              <CircularProgress variant="determinate" value={0} size={70} thickness={5} sx={{ position: 'absolute', left: 0, color: mode === 'dark' ? '#38bdf8' : 'primary.main' }} />
                              <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography variant="subtitle2" component="div" color="text.primary" sx={{ fontWeight: 800 }}>0%</Typography>
                              </Box>
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, fontWeight: 700 }}>Parishioners</Typography>
                          </Box>

                          {/* Gauge 2 */}
                          <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                              <CircularProgress variant="determinate" value={0} size={70} thickness={5} sx={{ color: mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }} />
                              <CircularProgress variant="determinate" value={0} size={70} thickness={5} sx={{ position: 'absolute', left: 0, color: 'secondary.main' }} />
                              <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography variant="subtitle2" component="div" color="text.primary" sx={{ fontWeight: 800 }}>0%</Typography>
                              </Box>
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, fontWeight: 700 }}>Clergy</Typography>
                          </Box>
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block', mt: 1 }}>
                          Average Sunday attendance rate
                        </Typography>
                      </Card>
                    </Grid>

                    {/* Card 8: Birthdays (Clergy & Staff) */}
                    <Grid item xs={12} md={4}>
                      <Card sx={{ height: 280, p: 3, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.85rem', mb: 0.5 }}>
                          Today's Birthdays (Clergy/Staff) 🎂
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
                          {staffBirthdays.length} staff members celebrating today
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
                          {staffBirthdays.length > 0 ? (
                            <List sx={{ width: '100%', overflowY: 'auto', maxHeight: 160 }}>
                              {staffBirthdays.map(m => (
                                <ListItem key={m.id} sx={{ py: 0.5, px: 1 }}>
                                  <ListItemText 
                                    primary={`${m.first_name} ${m.last_name}`} 
                                    secondary={`${m.role} • DOB: ${m.dob}`} 
                                    primaryTypographyProps={{ fontWeight: 700 }}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          ) : (
                            <>
                              <Avatar sx={{ width: 44, height: 44, bgcolor: mode === 'dark' ? 'rgba(56, 189, 248, 0.08)' : 'rgba(0, 0, 0, 0.02)', border: '1px dashed rgba(0, 0, 0, 0.06)' }}>
                                <CakeIcon color="secondary" sx={{ fontSize: 20 }} />
                              </Avatar>
                              <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>No birthdays today</Typography>
                                <Typography variant="caption" color="text.secondary">Check back tomorrow for celebrations!</Typography>
                              </Box>
                            </>
                          )}
                        </Box>
                      </Card>
                    </Grid>

                    {/* Card 9: Birthdays (Parishioners) */}
                    <Grid item xs={12} md={4}>
                      <Card sx={{ height: 280, p: 3, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.85rem', mb: 0.5 }}>
                          Today's Birthdays (Parishioners) 🎓
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
                          {parishionerBirthdays.length} parishioners celebrating today
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
                          {parishionerBirthdays.length > 0 ? (
                            <List sx={{ width: '100%', overflowY: 'auto', maxHeight: 160 }}>
                              {parishionerBirthdays.map(m => (
                                <ListItem key={m.id} sx={{ py: 0.5, px: 1 }}>
                                  <ListItemText 
                                    primary={`${m.first_name} ${m.last_name}`} 
                                    secondary={`${m.role} • DOB: ${m.dob}`} 
                                    primaryTypographyProps={{ fontWeight: 700 }}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          ) : (
                            <>
                              <Avatar sx={{ width: 44, height: 44, bgcolor: mode === 'dark' ? 'rgba(56, 189, 248, 0.08)' : 'rgba(0, 0, 0, 0.02)', border: '1px dashed rgba(0, 0, 0, 0.06)' }}>
                                <SchoolIcon color="secondary" sx={{ fontSize: 20 }} />
                              </Avatar>
                              <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>No birthdays today</Typography>
                                <Typography variant="caption" color="text.secondary">Check back tomorrow for celebrations!</Typography>
                              </Box>
                            </>
                          )}
                        </Box>
                      </Card>
                    </Grid>

                  </Grid>

                  {/* Footer Copyright matches the template footer style */}
                  <Box sx={{ mt: 8, pb: 1, textAlign: 'left', borderTop: '1px solid rgba(0,0,0,0.04)', pt: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Copyright © {new Date().getFullYear()}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* 2. DEANERIES SUB-TAB */}
              {activeSubTab === 'deaneries' && (
                <Box className="tab-content-enter-active">
                  
                  {/* Deaneries Summary Cards */}
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    {/* Card 1: Total Deaneries */}
                    <Grid item xs={12} md={4}>
                      <Card sx={{ height: 140, p: 3.5, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <AccountBalanceIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                            Total Deaneries
                          </Typography>
                        </Box>
                        <Box sx={{ mt: 1 }}>
                          <div className="serif-stat-number">{filteredDeaneries.length}</div>
                        </Box>
                        <AccountBalanceIcon sx={{ position: 'absolute', right: 16, bottom: 16, fontSize: '80px !important', color: mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', pointerEvents: 'none' }} />
                      </Card>
                    </Grid>

                    {/* Card 2: Active Deans */}
                    <Grid item xs={12} md={4}>
                      <Card sx={{ height: 140, p: 3.5, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <PeopleIcon sx={{ color: 'success.main', fontSize: 20 }} />
                          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                            Deans Assigned
                          </Typography>
                        </Box>
                        <Box sx={{ mt: 1 }}>
                          <div className="serif-stat-number">{filteredDeaneries.filter(d => d.dean).length}</div>
                        </Box>
                        <PeopleIcon sx={{ position: 'absolute', right: 16, bottom: 16, fontSize: '80px !important', color: mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', pointerEvents: 'none' }} />
                      </Card>
                    </Grid>

                    {/* Card 3: Vacant Deaneries */}
                    <Grid item xs={12} md={4}>
                      <Card sx={{ height: 140, p: 3.5, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <PeopleIcon sx={{ color: 'error.main', fontSize: 20 }} />
                          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                            Vacant Vicariates
                          </Typography>
                        </Box>
                        <Box sx={{ mt: 1 }}>
                          <div className="serif-stat-number">{filteredDeaneries.filter(d => !d.dean).length}</div>
                        </Box>
                        <PeopleIcon sx={{ position: 'absolute', right: 16, bottom: 16, fontSize: '80px !important', color: mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', pointerEvents: 'none' }} />
                      </Card>
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: 'secondary.light', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Deaneries Directory</Typography>
                    {canManageDeaneries && (
                      <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => handleOpenAdd('deanery')}>
                        Add Deanery
                      </Button>
                    )}
                  </Box>

                  <TableContainer component={Paper} sx={{ border: '1px solid rgba(99, 102, 241, 0.08)', boxShadow: 'none' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Deanery Name</TableCell>
                          <TableCell>Vicar Forane (Dean)</TableCell>
                          <TableCell>Description</TableCell>
                          {canManageDeaneries && <TableCell align="right" sx={{ pr: 3 }}>Actions</TableCell>}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredDeaneries.map(d => (
                          <TableRow key={d.id} hover>
                            <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>{d.name}</TableCell>
                            <TableCell>{d.dean || 'Vacant'}</TableCell>
                            <TableCell>{d.description || 'N/A'}</TableCell>
                            {canManageDeaneries && (
                              <TableCell align="right" sx={{ pr: 2 }}>
                                <IconButton onClick={() => handleOpenEdit('deanery', d)} size="small" color="primary"><EditIcon sx={{ fontSize: 18 }} /></IconButton>
                                <IconButton onClick={() => handleDelete('deanery', d.id)} size="small" color="error"><DeleteIcon sx={{ fontSize: 18 }} /></IconButton>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                        {filteredDeaneries.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                              No deaneries recorded under this diocese.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* 5. DIOCESES SUB-TAB */}
              {activeSubTab === 'dioceses' && (
                <Box className="tab-content-enter-active">
                  
                  {/* Dioceses Summary Cards */}
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    {/* Card 1: Total Dioceses */}
                    <Grid item xs={12} md={6}>
                      <Card sx={{ height: 120, p: 3, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <RoomIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                            Total Dioceses
                          </Typography>
                        </Box>
                        <Box sx={{ mt: 1 }}>
                          <div className="serif-stat-number">{dioceses.length}</div>
                        </Box>
                        <RoomIcon sx={{ position: 'absolute', right: 16, bottom: 16, fontSize: '80px !important', color: mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', pointerEvents: 'none' }} />
                      </Card>
                    </Grid>

                    {/* Card 2: Active Selected Diocese */}
                    <Grid item xs={12} md={6}>
                      <Card sx={{ height: 120, p: 3, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <ChurchIcon sx={{ color: 'success.main', fontSize: 20 }} />
                          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                            Active Diocese
                          </Typography>
                        </Box>
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 800, color: 'success.main', fontFamily: 'Georgia, serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {activeDiocese ? activeDiocese.name : 'None Selected'}
                          </Typography>
                        </Box>
                        <ChurchIcon sx={{ position: 'absolute', right: 16, bottom: 16, fontSize: '80px !important', color: mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', pointerEvents: 'none' }} />
                      </Card>
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: 'secondary.light', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dioceses Directory</Typography>
                    <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => handleOpenAdd('diocese')}>
                      Add Diocese
                    </Button>
                  </Box>

                  <TableContainer component={Paper} sx={{ border: '1px solid rgba(99, 102, 241, 0.08)', boxShadow: 'none' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ width: 100 }}>Status</TableCell>
                          <TableCell>Diocese Name</TableCell>
                          <TableCell>Bishop</TableCell>
                          <TableCell>Founded Year</TableCell>
                          <TableCell>Office Address</TableCell>
                          <TableCell align="right" sx={{ pr: 3 }}>Actions</TableCell>
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
                                  sx={{ minWidth: 80, fontSize: '0.75rem', py: 0.5 }}
                                >
                                  {isActive ? "Active" : "Select"}
                                </Button>
                              </TableCell>
                              <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>{d.name}</TableCell>
                              <TableCell>{d.bishop || 'No Bishop Assigned'}</TableCell>
                              <TableCell>{d.founded || 'N/A'}</TableCell>
                              <TableCell>{d.address || 'No Address Specified'}</TableCell>
                              <TableCell align="right" sx={{ pr: 2 }}>
                                <IconButton onClick={() => handleOpenEdit('diocese', d)} size="small" color="primary"><EditIcon sx={{ fontSize: 18 }} /></IconButton>
                                <IconButton onClick={() => handleDelete('diocese', d.id)} size="small" color="error"><DeleteIcon sx={{ fontSize: 18 }} /></IconButton>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        {dioceses.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                              No dioceses registered. Click "Add Diocese" to register one.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* 3. PARISHES SUB-TAB */}
              {activeSubTab === 'parishes' && (
                <Box className="tab-content-enter-active">
                  
                  {/* Parishes Summary Cards */}
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    {/* Card 1: Total Parishes */}
                    <Grid item xs={12} md={4}>
                      <Card sx={{ height: 140, p: 3.5, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <ChurchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                            Total Parishes
                          </Typography>
                        </Box>
                        <Box sx={{ mt: 1 }}>
                          <div className="serif-stat-number">{filteredParishes.length}</div>
                        </Box>
                        <ChurchIcon sx={{ position: 'absolute', right: 16, bottom: 16, fontSize: '80px !important', color: mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', pointerEvents: 'none' }} />
                      </Card>
                    </Grid>

                    {/* Card 2: Pastors Assigned */}
                    <Grid item xs={12} md={4}>
                      <Card sx={{ height: 140, p: 3.5, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <PeopleIcon sx={{ color: 'success.main', fontSize: 20 }} />
                          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                            Pastors Assigned
                          </Typography>
                        </Box>
                        <Box sx={{ mt: 1 }}>
                          <div className="serif-stat-number">{filteredParishes.filter(p => p.pastor).length}</div>
                        </Box>
                        <PeopleIcon sx={{ position: 'absolute', right: 16, bottom: 16, fontSize: '80px !important', color: mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', pointerEvents: 'none' }} />
                      </Card>
                    </Grid>

                    {/* Card 3: Active Channels */}
                    <Grid item xs={12} md={4}>
                      <Card sx={{ height: 140, p: 3.5, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <WalletIcon sx={{ color: 'secondary.main', fontSize: 20 }} />
                          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                            Parishes with Contacts
                          </Typography>
                        </Box>
                        <Box sx={{ mt: 1 }}>
                          <div className="serif-stat-number">{filteredParishes.filter(p => p.email || p.phone).length}</div>
                        </Box>
                        <WalletIcon sx={{ position: 'absolute', right: 16, bottom: 16, fontSize: '80px !important', color: mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', pointerEvents: 'none' }} />
                      </Card>
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: 'secondary.light', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Parishes Directory</Typography>
                    {canManageParishes && (
                      <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => handleOpenAdd('parish')}>
                        Add Parish
                      </Button>
                    )}
                  </Box>

                  <TableContainer component={Paper} sx={{ border: '1px solid rgba(99, 102, 241, 0.08)', boxShadow: 'none' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Parish Name</TableCell>
                          <TableCell>Deanery</TableCell>
                          <TableCell>Pastor (Priest-in-charge)</TableCell>
                          <TableCell>Contact Details</TableCell>
                          <TableCell>Address</TableCell>
                          {canManageParishes && <TableCell align="right" sx={{ pr: 3 }}>Actions</TableCell>}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredParishes.map(p => (
                          <TableRow key={p.id} hover>
                            <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>{p.name}</TableCell>
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
                              <TableCell align="right" sx={{ pr: 2 }}>
                                <IconButton onClick={() => handleOpenEdit('parish', p)} size="small" color="primary"><EditIcon sx={{ fontSize: 18 }} /></IconButton>
                                <IconButton onClick={() => handleDelete('parish', p.id)} size="small" color="error"><DeleteIcon sx={{ fontSize: 18 }} /></IconButton>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                        {filteredParishes.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                              No parishes recorded under this diocese.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* 4. MEMBERS SUB-TAB */}
              {activeSubTab === 'members' && (
                <Box className="tab-content-enter-active">
                  
                  {/* Parishioners Summary Cards */}
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    {/* Card 1: Total Parishioners */}
                    <Grid item xs={12} md={4}>
                      <Card sx={{ height: 140, p: 3.5, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <PeopleIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                            Total Parishioners
                          </Typography>
                        </Box>
                        <Box sx={{ mt: 1 }}>
                          <div className="serif-stat-number">{filteredMembers.length}</div>
                        </Box>
                        <PeopleIcon sx={{ position: 'absolute', right: 16, bottom: 16, fontSize: '80px !important', color: mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', pointerEvents: 'none' }} />
                      </Card>
                    </Grid>

                    {/* Card 2: Fully Initiated */}
                    <Grid item xs={12} md={4}>
                      <Card sx={{ height: 140, p: 3.5, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <BookIcon sx={{ color: 'success.main', fontSize: 20 }} />
                          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                            Fully Initiated
                          </Typography>
                        </Box>
                        <Box sx={{ mt: 1 }}>
                          <div className="serif-stat-number">
                            {filteredMembers.filter(m => m.baptism_received && m.communion_received && m.confirmation_received).length}
                          </div>
                        </Box>
                        <BookIcon sx={{ position: 'absolute', right: 16, bottom: 16, fontSize: '80px !important', color: mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', pointerEvents: 'none' }} />
                      </Card>
                    </Grid>

                    {/* Card 3: Ordained Clergy */}
                    <Grid item xs={12} md={4}>
                      <Card sx={{ height: 140, p: 3.5, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <ChurchIcon sx={{ color: 'secondary.main', fontSize: 20 }} />
                          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                            Ordained Clergy
                          </Typography>
                        </Box>
                        <Box sx={{ mt: 1 }}>
                          <div className="serif-stat-number">
                            {filteredMembers.filter(m => m.role === 'Priest' || m.role === 'Deacon').length}
                          </div>
                        </Box>
                        <ChurchIcon sx={{ position: 'absolute', right: 16, bottom: 16, fontSize: '80px !important', color: mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', pointerEvents: 'none' }} />
                      </Card>
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: 'secondary.light', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Parishioners (Members)</Typography>
                    {canManageMembers && (
                      <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => handleOpenAdd('member')}>
                        Register Member
                      </Button>
                    )}
                  </Box>

                  {/* Filter toolbar matches screenshot dark input shapes */}
                  <Paper sx={{ p: 2.5, mb: 3, border: '1px solid rgba(99,102,241,0.08)', boxShadow: 'none' }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={3}>
                          <TextField
                            fullWidth
                            size="small"
                            placeholder="Search by name, email..."
                            value={membersSearch}
                            onChange={(e) => setMembersSearch(e.target.value)}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <SearchIcon color="action" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4} md={3}>
                          <FormControl fullWidth size="small">
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
                        </Grid>
                        <Grid item xs={12} sm={4} md={3}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Role Filter</InputLabel>
                            <Select
                              value={membersRoleFilter}
                              label="Role Filter"
                              onChange={(e) => setMembersRoleFilter(e.target.value)}
                            >
                              <MenuItem value="all">All Roles</MenuItem>
                              <MenuItem value="Bishop">Bishop</MenuItem>
                              <MenuItem value="Parish Priest">Parish Priest</MenuItem>
                              <MenuItem value="Dean">Dean</MenuItem>
                              <MenuItem value="Sisters">Sisters</MenuItem>
                              <MenuItem value="Lay people">Lay people</MenuItem>
                              <MenuItem value="Youth">Youth</MenuItem>
                              <MenuItem value="Administrator">Administrator</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4} md={3}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Sacraments</InputLabel>
                            <Select
                              value={membersSacramentFilter}
                              label="Sacraments"
                              onChange={(e) => setMembersSacramentFilter(e.target.value)}
                            >
                              <MenuItem value="all">All Status</MenuItem>
                              <MenuItem value="baptism">Baptized</MenuItem>
                              <MenuItem value="communion">Holy Communion</MenuItem>
                              <MenuItem value="confirmation">Confirmed</MenuItem>
                              <MenuItem value="marriage">Married</MenuItem>
                              <MenuItem value="holy_orders">Holy Orders</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                  </Paper>

                  {/* Members List Table */}
                  <TableContainer component={Paper} sx={{ border: '1px solid rgba(99, 102, 241, 0.08)', boxShadow: 'none' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Member Name</TableCell>
                          <TableCell>Parish</TableCell>
                          <TableCell>Role / Gender</TableCell>
                          <TableCell>Contact Info</TableCell>
                          <TableCell>Sacraments Received</TableCell>
                          <TableCell align="right" sx={{ pr: 3 }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredMembers.map(m => {
                          const recs = [];
                          if (m.baptism_received) recs.push('Baptism');
                          if (m.communion_received) recs.push('Communion');
                          if (m.confirmation_received) recs.push('Confirmation');
                          if (m.marriage_received) recs.push('Marriage');
                          if (m.holy_orders_received) recs.push('Holy Orders');
                          
                          return (
                            <TableRow key={m.id} hover>
                              <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>
                                {m.first_name} {m.last_name}
                              </TableCell>
                              <TableCell>{m.parish_name}</TableCell>
                              <TableCell>
                                <Typography variant="body2">{m.role}</Typography>
                                <Typography variant="caption" color="text.secondary">{m.gender}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">{m.email || 'N/A'}</Typography>
                                <Typography variant="caption" color="text.secondary">{m.phone || ''}</Typography>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
                                  {recs.map((sac, idx) => (
                                    <Box 
                                      key={idx} 
                                      sx={{ 
                                        bgcolor: 'rgba(6, 182, 212, 0.12)', 
                                        color: '#22d3ee', 
                                        px: 1.5, 
                                        py: 0.6, 
                                        borderRadius: 2.5, 
                                        fontSize: '0.72rem', 
                                        fontWeight: 800,
                                        border: '1px solid rgba(6, 182, 212, 0.15)'
                                      }}
                                    >
                                      {sac}
                                    </Box>
                                  ))}
                                  {recs.length === 0 && (
                                    <Typography variant="caption" color="text.disabled">None recorded</Typography>
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell align="right" sx={{ pr: 2 }}>
                                <IconButton onClick={() => { setSelectedMember(m); setProfileDrawerOpen(true); }} size="small" color="info"><VisibilityIcon sx={{ fontSize: 18 }} /></IconButton>
                                {canManageMembers && (
                                  <>
                                    <IconButton onClick={() => handleOpenEdit('member', m)} size="small" color="primary"><EditIcon sx={{ fontSize: 18 }} /></IconButton>
                                    <IconButton onClick={() => handleDelete('member', m.id)} size="small" color="error"><DeleteIcon sx={{ fontSize: 18 }} /></IconButton>
                                  </>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        {filteredMembers.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                              No parishioners match the selected filters.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

            </Box>
          )}

          {/* 6. USERS SUB-TAB */}
          {activeSubTab === 'users' && (
            <Box className="tab-content-enter-active">
              
              {/* Users Summary Metric Card */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                  <Card sx={{ height: 120, p: 3, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <PeopleIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                        Total Registered Users
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 1 }}>
                      <div className="serif-stat-number">{users.length}</div>
                    </Box>
                    <PeopleIcon sx={{ position: 'absolute', right: 16, bottom: 16, fontSize: '80px !important', color: mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', pointerEvents: 'none' }} />
                  </Card>
                </Grid>
              </Grid>

              {/* Add User Section & User List */}
              <Grid container spacing={4}>
                {/* Column 1: Add User Form */}
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 3, border: '1px solid rgba(99, 102, 241, 0.08)', boxShadow: 'none' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', mb: 3 }}>
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
                            <MenuItem value="Bishop">Bishop</MenuItem>
                            <MenuItem value="Parish Priest">Parish Priest</MenuItem>
                            <MenuItem value="Dean">Dean</MenuItem>
                            <MenuItem value="Sisters">Sisters</MenuItem>
                            <MenuItem value="Lay people">Lay people</MenuItem>
                            <MenuItem value="Youth">Youth</MenuItem>
                            <MenuItem value="Administrator">Administrator</MenuItem>
                          </Select>
                        </FormControl>
                        <Button type="submit" variant="contained" fullWidth sx={{ mt: 1 }}>
                          Register User
                        </Button>
                      </Box>
                    </form>
                  </Paper>
                </Grid>

                {/* Column 2: User List Table */}
                <Grid item xs={12} md={8}>
                  <TableContainer component={Paper} sx={{ border: '1px solid rgba(99, 102, 241, 0.08)', boxShadow: 'none' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ width: 100 }}>User ID</TableCell>
                          <TableCell>Username</TableCell>
                          <TableCell>Role</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.map(u => (
                          <TableRow key={u.id} hover>
                            <TableCell sx={{ color: 'text.secondary' }}>#{u.id}</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>{u.username}</TableCell>
                            <TableCell>
                              <Box sx={{ 
                                display: 'inline-block', 
                                px: 2, 
                                py: 0.5, 
                                borderRadius: '12px', 
                                fontSize: '0.75rem', 
                                fontWeight: 700, 
                                bgcolor: u.role === 'Admin' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(74, 222, 128, 0.15)', 
                                color: u.role === 'Admin' ? 'primary.light' : 'success.main' 
                              }}>
                                {u.role}
                              </Box>
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

          {/* 7. PERMISSIONS SUB-TAB */}
          {activeSubTab === 'permissions' && (
            <Box className="tab-content-enter-active">
              
              <Typography variant="h5" sx={{ fontWeight: 900, mb: 3 }}>
                Permissions Settings
              </Typography>

              {/* Filters row matches screenshot filters */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel id="role-select-label">Role</InputLabel>
                    <Select
                      labelId="role-select-label"
                      value={permissionsRole}
                      label="Role"
                      onChange={e => setPermissionsRole(e.target.value)}
                    >
                      <MenuItem value="Bishop">Bishop</MenuItem>
                      <MenuItem value="Parish Priest">Parish Priest</MenuItem>
                      <MenuItem value="Dean">Dean</MenuItem>
                      <MenuItem value="Sisters">Sisters</MenuItem>
                      <MenuItem value="Lay people">Lay people</MenuItem>
                      <MenuItem value="Youth">Youth</MenuItem>
                      <MenuItem value="Administrator">Administrator</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel id="type-select-label">Type</InputLabel>
                    <Select
                      labelId="type-select-label"
                      value={permissionsType}
                      label="Type"
                      onChange={e => setPermissionsType(e.target.value)}
                    >
                      <MenuItem value="all">Any</MenuItem>
                      <MenuItem value="create">Create</MenuItem>
                      <MenuItem value="view">View</MenuItem>
                      <MenuItem value="edit">Edit</MenuItem>
                      <MenuItem value="delete">Delete</MenuItem>
                      <MenuItem value="export">Export</MenuItem>
                      <MenuItem value="print">Print</MenuItem>
                      <MenuItem value="send">Send</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    placeholder="Search by page..."
                    value={permissionsSearch}
                    onChange={e => setPermissionsSearch(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>

              {/* Permissions Grid Table */}
              <TableContainer component={Paper} sx={{ border: '1px solid rgba(99, 102, 241, 0.08)', boxShadow: 'none', mb: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: 80, fontWeight: 800 }}>S.NO</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>PAGE</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 800 }}>CREATE</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 800 }}>VIEW</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 800 }}>EDIT</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 800 }}>DELETE</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 800 }}>EXPORT</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 800 }}>PRINT</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 800 }}>SEND</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rolePermissionsMatrix
                      .filter(p => p.page.toLowerCase().includes(permissionsSearch.toLowerCase()))
                      .map((p, idx) => (
                        <TableRow key={p.id || idx} hover>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>{p.page}</TableCell>
                          
                          {/* CREATE */}
                          <TableCell align="center">
                            <Checkbox 
                              checked={p.can_create === 1}
                              onChange={() => handleCheckboxChange(idx, 'can_create')}
                              disabled={permissionsType !== 'all' && permissionsType !== 'create'}
                            />
                          </TableCell>

                          {/* VIEW */}
                          <TableCell align="center">
                            <Checkbox 
                              checked={p.can_view === 1}
                              onChange={() => handleCheckboxChange(idx, 'can_view')}
                              disabled={permissionsType !== 'all' && permissionsType !== 'view'}
                            />
                          </TableCell>

                          {/* EDIT */}
                          <TableCell align="center">
                            <Checkbox 
                              checked={p.can_edit === 1}
                              onChange={() => handleCheckboxChange(idx, 'can_edit')}
                              disabled={permissionsType !== 'all' && permissionsType !== 'edit'}
                            />
                          </TableCell>

                          {/* DELETE */}
                          <TableCell align="center">
                            <Checkbox 
                              checked={p.can_delete === 1}
                              onChange={() => handleCheckboxChange(idx, 'can_delete')}
                              disabled={permissionsType !== 'all' && permissionsType !== 'delete'}
                            />
                          </TableCell>

                          {/* EXPORT */}
                          <TableCell align="center">
                            <Checkbox 
                              checked={p.can_export === 1}
                              onChange={() => handleCheckboxChange(idx, 'can_export')}
                              disabled={permissionsType !== 'all' && permissionsType !== 'export'}
                            />
                          </TableCell>

                          {/* PRINT */}
                          <TableCell align="center">
                            <Checkbox 
                              checked={p.can_print === 1}
                              onChange={() => handleCheckboxChange(idx, 'can_print')}
                              disabled={permissionsType !== 'all' && permissionsType !== 'print'}
                            />
                          </TableCell>

                          {/* SEND */}
                          <TableCell align="center">
                            <Checkbox 
                              checked={p.can_send === 1}
                              onChange={() => handleCheckboxChange(idx, 'can_send')}
                              disabled={permissionsType !== 'all' && permissionsType !== 'send'}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Submit Button */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
                <Button 
                  variant="contained" 
                  onClick={handlePermissionsSubmit} 
                  sx={{ 
                    bgcolor: '#6366f1', 
                    px: 4, 
                    py: 1.5, 
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                >
                  Submit
                </Button>
              </Box>

            </Box>
          )}

        </Container>
      </Box>

      {/* Global Dialog Form */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth={dialogType === 'member' ? 'md' : 'sm'}
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 800, color: 'secondary.light', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="span" sx={{ fontWeight: 800 }}>
            {editItem ? 'Edit' : 'Add New'} {dialogType && dialogType[0].toUpperCase() + dialogType.slice(1)}
          </Typography>
          <IconButton onClick={() => setDialogOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent separators>
          
          {/* Diocese Form */}
          {dialogType === 'diocese' && (
            <Grid container spacing={2} sx={{ pt: 1 }}>
              <Grid item xs={12}>
                <TextField fullWidth label="Diocese Name" value={dioceseForm.name} onChange={(e) => setDioceseForm({ ...dioceseForm, name: e.target.value })} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Bishop" value={dioceseForm.bishop} onChange={(e) => setDioceseForm({ ...dioceseForm, bishop: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Founded Year" value={dioceseForm.founded} onChange={(e) => setDioceseForm({ ...dioceseForm, founded: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Email" value={dioceseForm.email} onChange={(e) => setDioceseForm({ ...dioceseForm, email: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Phone" value={dioceseForm.phone} onChange={(e) => setDioceseForm({ ...dioceseForm, phone: e.target.value })} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Chancery Address" value={dioceseForm.address} onChange={(e) => setDioceseForm({ ...dioceseForm, address: e.target.value })} multiline rows={2} />
              </Grid>
            </Grid>
          )}

          {/* Deanery Form */}
          {dialogType === 'deanery' && (
            <Grid container spacing={2} sx={{ pt: 1 }}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Parent Diocese</InputLabel>
                  <Select
                    value={deaneryForm.diocese_id}
                    label="Parent Diocese"
                    onChange={(e) => setDeaneryForm({ ...deaneryForm, diocese_id: e.target.value })}
                  >
                    {dioceses.map(d => (
                      <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Deanery Name" value={deaneryForm.name} onChange={(e) => setDeaneryForm({ ...deaneryForm, name: e.target.value })} required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Vicar Forane (Dean)" value={deaneryForm.dean} onChange={(e) => setDeaneryForm({ ...deaneryForm, dean: e.target.value })} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Description" value={deaneryForm.description} onChange={(e) => setDeaneryForm({ ...deaneryForm, description: e.target.value })} multiline rows={2} />
              </Grid>
            </Grid>
          )}

          {/* Parish Form */}
          {dialogType === 'parish' && (
            <Grid container spacing={2} sx={{ pt: 1 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Diocese</InputLabel>
                  <Select
                    value={parishForm.diocese_id}
                    label="Diocese"
                    onChange={(e) => {
                      const dId = e.target.value;
                      const filtered = deaneries.filter(dn => dn.diocese_id === dId);
                      setParishForm({ 
                        ...parishForm, 
                        diocese_id: dId,
                        deanery_id: filtered[0]?.id || ''
                      });
                    }}
                  >
                    {dioceses.map(d => (
                      <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Deanery</InputLabel>
                  <Select
                    value={parishForm.deanery_id}
                    label="Deanery"
                    onChange={(e) => setParishForm({ ...parishForm, deanery_id: e.target.value })}
                  >
                    {deaneries.filter(dn => dn.diocese_id === parishForm.diocese_id).map(dn => (
                      <MenuItem key={dn.id} value={dn.id}>{dn.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Parish Name" value={parishForm.name} onChange={(e) => setParishForm({ ...parishForm, name: e.target.value })} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Parish Priest (Pastor)" value={parishForm.pastor} onChange={(e) => setParishForm({ ...parishForm, pastor: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Assistant Pastor" value={parishForm.assistant_pastor} onChange={(e) => setParishForm({ ...parishForm, assistant_pastor: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Parish Email" value={parishForm.email} onChange={(e) => setParishForm({ ...parishForm, email: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Parish Phone" value={parishForm.phone} onChange={(e) => setParishForm({ ...parishForm, phone: e.target.value })} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Parish Address" value={parishForm.address} onChange={(e) => setParishForm({ ...parishForm, address: e.target.value })} multiline rows={2} />
              </Grid>
            </Grid>
          )}

          {/* Member Form */}
          {dialogType === 'member' && (
            <Grid container spacing={3} sx={{ pt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'secondary.light', mb: 1 }}>Profile Information</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Parish Association</InputLabel>
                  <Select
                    value={memberForm.parish_id}
                    label="Parish Association"
                    onChange={(e) => setMemberForm({ ...memberForm, parish_id: e.target.value })}
                  >
                    {filteredParishes.map(p => (
                      <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={memberForm.role}
                    label="Role"
                    onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                  >
                    <MenuItem value="Bishop">Bishop</MenuItem>
                    <MenuItem value="Parish Priest">Parish Priest</MenuItem>
                    <MenuItem value="Dean">Dean</MenuItem>
                    <MenuItem value="Sisters">Sisters</MenuItem>
                    <MenuItem value="Lay people">Lay people</MenuItem>
                    <MenuItem value="Youth">Youth</MenuItem>
                    <MenuItem value="Administrator">Administrator</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={memberForm.gender}
                    label="Gender"
                    onChange={(e) => setMemberForm({ ...memberForm, gender: e.target.value })}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="First Name" value={memberForm.first_name} onChange={(e) => setMemberForm({ ...memberForm, first_name: e.target.value })} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Last Name" value={memberForm.last_name} onChange={(e) => setMemberForm({ ...memberForm, last_name: e.target.value })} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="date" label="Date of Birth" InputLabelProps={{ shrink: true }} value={memberForm.dob} onChange={(e) => setMemberForm({ ...memberForm, dob: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Email" value={memberForm.email} onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Phone" value={memberForm.phone} onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Residential Address" value={memberForm.address} onChange={(e) => setMemberForm({ ...memberForm, address: e.target.value })} />
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'secondary.light', mb: 1 }}>Sacramental Records</Typography>
                
                {[
                  { key: 'baptism', label: '1. Sacrament of Baptism' },
                  { key: 'communion', label: '2. Sacrament of Holy Communion' },
                  { key: 'confirmation', label: '3. Sacrament of Confirmation' },
                  { key: 'marriage', label: '4. Sacrament of Holy Matrimony' },
                  { key: 'holy_orders', label: '5. Sacrament of Holy Orders' }
                ].map((sac) => {
                  const isChecked = memberForm[`${sac.key}_received`];
                  return (
                    <Accordion key={sac.key} sx={{ mb: 1, border: '1px solid rgba(0,0,0,0.06)' }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <FormControlLabel
                          control={
                            <Checkbox 
                              checked={isChecked} 
                              onClick={(e) => e.stopPropagation()} 
                              onChange={(e) => setMemberForm({ ...memberForm, [`${sac.key}_received`]: e.target.checked })} 
                            />
                          }
                          label={sac.label}
                          sx={{ pointerEvents: 'auto' }}
                        />
                      </AccordionSummary>
                      <AccordionDetails>
                        <Collapse in={isChecked}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <TextField 
                                fullWidth 
                                type="date" 
                                label="Date Received" 
                                InputLabelProps={{ shrink: true }} 
                                value={memberForm[`${sac.key}_date`] || ''} 
                                onChange={(e) => setMemberForm({ ...memberForm, [`${sac.key}_date`]: e.target.value })}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField 
                                  fullWidth 
                                  label="Parish of Record" 
                                  value={memberForm[`${sac.key}_parish`] || ''} 
                                  onChange={(e) => setMemberForm({ ...memberForm, [`${sac.key}_parish`]: e.target.value })}
                                />
                              </Grid>
                            </Grid>
                          </Collapse>
                          {!isChecked && (
                            <Typography variant="body2" color="text.secondary">Sacrament not marked as received.</Typography>
                          )}
                        </AccordionDetails>
                      </Accordion>
                    );
                  })}
                </Grid>
              </Grid>
            )}

        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="secondary">Save Entry</Button>
        </DialogActions>
      </Dialog>

      {/* Member Profile Drawer */}
      <Drawer
        anchor="right"
        open={profileDrawerOpen}
        onClose={() => setProfileDrawerOpen(false)}
        sx={{
          [`& .MuiDrawer-paper`]: { width: { xs: '100%', sm: 460 }, p: 3, boxSizing: 'border-box' }
        }}
      >
        {selectedMember && (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.light' }}>Member Profile</Typography>
              <IconButton onClick={() => setProfileDrawerOpen(false)}><CloseIcon /></IconButton>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '32px', fontWeight: 700, mb: 2, boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}>
                {selectedMember.first_name[0]}{selectedMember.last_name[0]}
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>{selectedMember.first_name} {selectedMember.last_name}</Typography>
              <Badge badgeContent={selectedMember.role} color="secondary" sx={{ mt: 1.5, '& .MuiBadge-badge': { px: 1.5, py: 1.2, borderRadius: 3, position: 'static', transform: 'none' } }} />
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 800, mb: 2 }}>Personal Details</Typography>
              <Grid container spacing={2}>
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
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, wordBreak: 'break-all' }}>{selectedMember.email || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Parish Registry</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedMember.parish_name}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Residential Address</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedMember.address || 'N/A'}</Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 800, mb: 2 }}>Sacraments Received</Typography>
              
              {[
                { key: 'baptism', label: 'Sacrament of Baptism' },
                { key: 'communion', label: 'Sacrament of Holy Communion' },
                { key: 'confirmation', label: 'Sacrament of Confirmation' },
                { key: 'marriage', label: 'Sacrament of Holy Matrimony' },
                { key: 'holy_orders', label: 'Sacrament of Holy Orders' }
              ].map(sac => {
                const received = selectedMember[`${sac.key}_received`] === 1;
                return (
                  <Box key={sac.key} sx={{ display: 'flex', gap: 2, mb: 2.5, alignItems: 'flex-start' }}>
                    <Box 
                      sx={{ 
                        width: 22, 
                        height: 22, 
                        borderRadius: '50%', 
                        bgcolor: received ? 'secondary.main' : 'rgba(255,255,255,0.03)',
                        border: received ? 'none' : '1px solid rgba(255,255,255,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontSize: '11px',
                        fontWeight: 900,
                        mt: 0.2,
                        boxShadow: received ? '0 0 10px rgba(6,182,212,0.4)' : 'none'
                      }}
                    >
                      {received ? '✓' : ''}
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: received ? 'text.primary' : 'text.secondary' }}>
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
                  </Box>
                );
              })}
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
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
            </Box>
          </Box>
        )}
      </Drawer>

      {/* Toast Alerts */}
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

      {/* Confirmation modal */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          {confirmTitle}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={() => {
              setConfirmOpen(false);
              if (onConfirmCallback) onConfirmCallback();
            }}
            color="error"
            variant="contained"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
