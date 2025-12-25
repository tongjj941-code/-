
import React, { useState, useRef, useEffect } from 'react';
import { LogIn, ChevronLeft, CheckCircle2, Building, Home, LogOut, Plus, ScanLine, Delete, ClipboardList, ChevronRight, ChevronDown, Calendar, AlertTriangle, Settings, Trash2, Edit2, Upload, Save, X, ClipboardCheck, FilePlus2, FileEdit, Search, Filter, Layers, Wrench, CheckSquare, Clock, Users, UserPlus, Shield, ShieldAlert, User, Megaphone, Ticket, Gift, Coins, FileSpreadsheet, Download, CalendarRange, Star, ScrollText, Lock, Image as ImageIcon, ExternalLink, MoreHorizontal, Eye, ThumbsUp, ThumbsDown, CheckCheck, HelpCircle, MessageSquareText, Send, Archive, Globe, PackagePlus, History, RefreshCcw, Check } from 'lucide-react';
import { ViewState, CheckItemDefinition, InspectionState, IssueType, IssueReport, CompletedInspection, InspectionStepData, CheckCategory, UserRole, RoomTypeDefinition, RoomConfig, AuthorizedUser, MarketingTask, CompletedMarketingTask, CouponTask, ReviewTask } from './types';
import { ChecklistCard } from './components/ChecklistCard';
import { IssueModal } from './components/IssueModal';

// --- Constants & Data Definitions ---
const AVAILABLE_HOTELS = [
  "君悦演示酒店",
  "北京希尔顿酒店", 
  "上海万豪酒店", 
  "深圳洲际酒店", 
  "广州喜来登酒店", 
  "杭州四季酒店",
  "香港丽思卡尔顿酒店",
  "台北文华东方酒店",
  "成都W酒店",
  "三亚瑞吉度假酒店"
];

const FIXED_ROOM_NUMBERS = ["101", "102", "103", "104", "105", "106", "107", "108"];

const DEFAULT_CHECKLIST_ITEMS_STD: CheckItemDefinition[] = [
  {
    id: 'area_sleep',
    title: '睡眠区',
    category: 'MATERIAL',
    description: '巡检床铺整理情况（无皱褶、无毛发）、床头柜整洁度、床头灯及电话功能。',
    referenceImage: 'https://picsum.photos/id/1033/400/300'
  },
  {
    id: 'area_bath',
    title: '卫浴区',
    category: 'MATERIAL',
    description: '巡检马桶清洁、淋浴房水渍、洗手台面整洁、毛巾及洗浴用品补充情况。',
    referenceImage: 'https://picsum.photos/id/1042/400/300'
  },
  {
    id: 'area_reading',
    title: '阅读办公区',
    category: 'EQUIPMENT',
    description: '巡检书桌台面清洁、台灯功能、沙发/座椅状况及地毯吸尘情况。',
    referenceImage: 'https://picsum.photos/id/526/400/300'
  }
];

const DEFAULT_CHECKLIST_ITEMS_SUITE: CheckItemDefinition[] = [
  ...DEFAULT_CHECKLIST_ITEMS_STD,
  {
    id: 'area_bar',
    title: '吧台区 (套房)',
    category: 'MATERIAL',
    description: '巡检迷你吧酒水库存、咖啡机/水壶清洁状况、杯具是否透亮。',
    referenceImage: 'https://picsum.photos/id/425/400/300'
  },
  {
    id: 'area_balcony',
    title: '阳台区',
    category: 'EQUIPMENT',
    description: '巡检户外桌椅清洁度、栏杆安全性、地面是否无杂物。',
    referenceImage: 'https://picsum.photos/id/249/400/300'
  }
];

const DEFAULT_ROOM_TYPES: RoomTypeDefinition[] = [
  { id: 'std', name: '标准大床房', items: DEFAULT_CHECKLIST_ITEMS_STD },
  { id: 'suite', name: '行政套房', items: DEFAULT_CHECKLIST_ITEMS_SUITE }
];

const INITIAL_USERS: AuthorizedUser[] = [
    { id: 'u1', name: '王经理', employeeId: '9999', role: 'ADMIN', avatarColor: 'bg-blue-500', hotelName: '集团总部' },
    { id: 'u2', name: '李阿姨', employeeId: '1001', role: 'STAFF', avatarColor: 'bg-green-500', hotelName: '君悦演示酒店' },
    { id: 'u3', name: '张师傅', employeeId: '1002', role: 'STAFF', avatarColor: 'bg-orange-500', hotelName: '君悦演示酒店' },
];

const DEFAULT_MARKETING_TASKS: MarketingTask[] = [
    {
        id: 'mkt_1',
        title: '朋友圈早安海报转发',
        description: '请各位同事每天上午10点前，将早安海报转发至朋友圈，并集齐5个点赞。截图中需包含点赞数量。',
        images: [
            'https://picsum.photos/id/1047/400/600',
            'https://picsum.photos/id/1015/400/600'
        ],
        status: 'ACTIVE',
        createdAt: '2023-10-20',
        rewardAmount: '2元/次',
        notes: '截图需清晰展示订单号、住客姓名、房号、离店时间'
    }
];

const DEFAULT_COUPON_TASKS: CouponTask[] = [
    {
        id: 'cpn_1',
        title: '房型升级券核销奖励',
        description: '成功向客人推荐升级并核销升级券',
        images: ['https://picsum.photos/id/1050/400/600'],
        status: 'ACTIVE',
        createdAt: '2023-10-22',
        rewardAmount: '10元/张',
        notes: '截图需清晰展示订单号、升级券类别、住客姓名、房号、离店时间'
    }
];

const DEFAULT_REVIEW_TASKS: ReviewTask[] = [
    {
        id: 'rvw_1',
        title: '住客好评引导',
        description: '引导离店客人在OTA平台发布带图好评，并在评论中提及员工姓名。',
        images: ['https://picsum.photos/id/1060/400/600'],
        status: 'ACTIVE',
        createdAt: '2023-10-22',
        rewardAmount: '10元/条',
        notes: '截图需包含评价内容及员工姓名',
        channels: '携程, 美团, 飞猪'
    }
];

const MOCK_HISTORY: CompletedInspection[] = [
  {
    id: 'hist_1',
    roomNumber: '204',
    roomTypeId: 'std',
    hotelName: '君悦演示酒店',
    completedAt: '2023/10/24 14:30',
    status: 'APPROVED',
    userId: 'u2',
    steps: {
      'area_sleep': { photo: 'https://picsum.photos/id/100/200/200', timestamp: '14:25', issues: [] },
      'area_reading': { photo: 'https://picsum.photos/id/200/200/200', timestamp: '14:28', issues: [{ id: 'iss_1', type: 'FAULT', description: '台灯闪烁', status: 'OPEN' }] }
    }
  },
  {
    id: 'hist_2',
    roomNumber: '305',
    roomTypeId: 'suite',
    hotelName: '北京希尔顿酒店',
    completedAt: '2023/10/24 10:15',
    status: 'PENDING',
    userId: 'u2',
    steps: {
       'area_bath': { photo: 'https://picsum.photos/id/1042/200/200', timestamp: '10:10', issues: [{ id: 'iss_2', type: 'RESTOCK', description: '缺少备用卫生纸', status: 'OPEN' }] }
    }
  }
];

// --- Helper Components ---

const SearchableHotelSelect: React.FC<{ selectedHotel: string; onSelect: (hotel: string) => void; placeholder?: string; className?: string }> = ({ selectedHotel, onSelect, placeholder = "选择酒店...", className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
        searchInputRef.current.focus();
        setSearchTerm('');
    }
  }, [isOpen]);

  const filteredHotels = AVAILABLE_HOTELS.filter(h => 
    h.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-200 text-gray-700 py-3 px-3 pr-8 rounded-lg text-left outline-none focus:ring-2 focus:ring-green-500 flex justify-between items-center"
      >
        <span className={selectedHotel ? "text-gray-800" : "text-gray-400"}>
          {selectedHotel || placeholder}
        </span>
        <ChevronDown size={16} className="text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="搜索..."
                    className="w-full bg-gray-50 rounded-lg py-2 pl-8 pr-3 text-sm outline-none focus:bg-white focus:ring-1 focus:ring-green-500"
                />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredHotels.length > 0 ? (
                filteredHotels.map(hotel => (
                <button
                    key={hotel}
                    type="button"
                    onClick={() => {
                        onSelect(hotel);
                        setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-green-50 transition-colors ${selectedHotel === hotel ? 'bg-green-50 text-green-700 font-bold' : 'text-gray-700'}`}
                >
                    {hotel}
                </button>
                ))
            ) : (
                <div className="px-4 py-3 text-xs text-gray-400 text-center">无匹配结果</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


// --- Main App Component ---
export function App() {
  const [view, setView] = useState<ViewState>('HOTEL_SELECT');
  const [previousView, setPreviousView] = useState<ViewState>('HOME'); // Track history for Back button
  const [userRole, setUserRole] = useState<UserRole>('ADMIN');
  const [currentUser, setCurrentUser] = useState<AuthorizedUser | null>(INITIAL_USERS[0]);
  
  const [hotelName, setHotelName] = useState('');
  const [roomTypes, setRoomTypes] = useState<RoomTypeDefinition[]>(DEFAULT_ROOM_TYPES);
  const [managedRooms, setManagedRooms] = useState<RoomConfig[]>([
    { number: "101", typeId: "std" },
    { number: "102", typeId: "std" },
    { number: "103", typeId: "std" },
    { number: "104", typeId: "suite" },
  ]);
  
  // Tasks are controlled by these master states
  const [marketingTasks, setMarketingTasks] = useState<MarketingTask[]>(DEFAULT_MARKETING_TASKS);
  const [couponTasks, setCouponTasks] = useState<CouponTask[]>(DEFAULT_COUPON_TASKS);
  const [reviewTasks, setReviewTasks] = useState<ReviewTask[]>(DEFAULT_REVIEW_TASKS);

  const [marketingHistory, setMarketingHistory] = useState<CompletedMarketingTask[]>([]);
  const [selectedMarketingRecord, setSelectedMarketingRecord] = useState<CompletedMarketingTask | null>(null);
  const [marketingHistoryTab, setMarketingHistoryTab] = useState<'ALL' | 'MKT' | 'CPN' | 'RVW'>('ALL');

  const [authorizedUsers, setAuthorizedUsers] = useState<AuthorizedUser[]>(INITIAL_USERS);
  const [currentInspection, setCurrentInspection] = useState<InspectionState>({
    roomNumber: '',
    roomTypeId: '',
    hotelName: '',
    steps: {}
  });
  const [history, setHistory] = useState<CompletedInspection[]>(MOCK_HISTORY);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<CompletedInspection | null>(null);
  const [historyFilterHotel, setHistoryFilterHotel] = useState<string>('');
  const [historyStartDate, setHistoryStartDate] = useState<string>('');
  const [historyEndDate, setHistoryEndDate] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeIssueType, setActiveIssueType] = useState<IssueType>('OTHER');
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  // Track currently being edited issue data
  const [editingIssueData, setEditingIssueData] = useState<IssueReport | undefined>(undefined);

  const [activeTypeId, setActiveTypeId] = useState<string>(DEFAULT_ROOM_TYPES[0]?.id || '');

  useEffect(() => {
    if (!activeTypeId && roomTypes.length > 0) {
        setActiveTypeId(roomTypes[0].id);
    }
  }, [roomTypes, activeTypeId]);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const id = formData.get('employeeId') as string;
    const user = authorizedUsers.find(u => u.employeeId === id);
    if (user) {
        setUserRole(user.role);
        setCurrentUser(user);
        if (user.role === 'ADMIN') setView('HOTEL_SELECT');
        else {
            setHotelName(user.hotelName || AVAILABLE_HOTELS[0]);
            setView('HOME');
        }
    } else alert("未找到该员工ID，请联系管理员添加权限。");
  };

  const handleLogout = () => {
    setView('LOGIN');
    setCurrentUser(null);
    setHotelName('');
  };

  const startInspection = (roomNumber: string) => {
    const roomConfig = managedRooms.find(r => r.number === roomNumber);
    if(!roomConfig) return;
    setCurrentInspection({
      roomNumber: roomNumber,
      roomTypeId: roomConfig.typeId,
      hotelName: hotelName,
      steps: {}
    });
    setView('INSPECTION');
  };

  const handlePhotoCapture = (itemId: string, photo: string, timestamp: string) => {
    setCurrentInspection(prev => ({
      ...prev,
      steps: {
        ...prev.steps,
        [itemId]: {
          ...prev.steps[itemId],
          photo,
          timestamp,
          issues: prev.steps[itemId]?.issues || []
        }
      }
    }));
  };

  const openIssueModal = (itemId: string, type: IssueType) => {
    const existingIssues = currentInspection.steps[itemId]?.issues || [];
    const existingIssue = existingIssues.find(i => i.type === type);
    
    setEditingIssueData(existingIssue);
    setActiveItemId(itemId);
    setActiveIssueType(type);
    setModalOpen(true);
  };

  const handleSubmitIssue = (description: string, attachment: string | undefined, isVideo: boolean) => {
    if (!activeItemId) return;
    
    setCurrentInspection(prev => {
      const stepData = prev.steps[activeItemId] || { photo: null, timestamp: null, issues: [] };
      const existingIssues = stepData.issues;
      const existingIndex = existingIssues.findIndex(i => i.type === activeIssueType);

      let newIssues = [...existingIssues];
      
      if (existingIndex > -1) {
          // Update existing
          newIssues[existingIndex] = {
              ...newIssues[existingIndex],
              description,
              attachment,
              isVideo
          };
      } else {
          // Add new
          const newIssue: IssueReport = {
            id: Date.now().toString(),
            type: activeIssueType,
            description,
            attachment,
            isVideo,
            status: 'OPEN'
          };
          newIssues.push(newIssue);
      }

      return {
        ...prev,
        steps: {
          ...prev.steps,
          [activeItemId]: {
            ...stepData,
            issues: newIssues
          }
        }
      };
    });
  };

  const submitInspection = () => {
    const completedRecord: CompletedInspection = {
      ...currentInspection,
      id: Date.now().toString(),
      completedAt: new Date().toLocaleString('zh-CN', { hour12: false, month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      status: 'PENDING',
      userId: currentUser?.id || ''
    };
    setHistory(prev => [completedRecord, ...prev]);
    setView('SUCCESS');
  };

  const viewHistoryDetail = (item: CompletedInspection) => {
    setPreviousView(view); // Remember where we came from
    setSelectedHistoryItem(item);
    setView('HISTORY_DETAIL');
  };

  const toggleIssueStatus = (inspectionId: string, issueId: string) => {
    setHistory(prev => prev.map(inspection => {
      if (inspection.id !== inspectionId) return inspection;
      const newSteps = { ...inspection.steps };
      Object.keys(newSteps).forEach(key => {
        const stepId = key;
        const step = newSteps[stepId] as InspectionStepData;
        
        // Find if this step contains the issue to update
        if (step.issues && step.issues.some(i => i.id === issueId)) {
             newSteps[stepId] = {
                 ...step,
                 issues: step.issues.map(issue => {
                    if (issue.id === issueId) {
                        const newStatus = issue.status === 'OPEN' ? 'RESOLVED' : 'OPEN';
                        return { 
                            ...issue, 
                            status: newStatus,
                            resolvedAt: newStatus === 'RESOLVED' ? new Date().toLocaleString('zh-CN', { hour12: false }) : undefined
                        };
                    }
                    return issue;
                 })
             };
        }
      });
      return { ...inspection, steps: newSteps };
    }));
  };

  const getItemsForInspection = (typeId: string): CheckItemDefinition[] => {
    const type = roomTypes.find(t => t.id === typeId);
    return type ? type.items : [];
  };

  const LogoutButton = () => (
      <button onClick={handleLogout} className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors active:scale-95">
          <LogOut size={20} />
      </button>
  );

  const BottomNav = () => (
    <div className="bg-white border-t border-gray-200 p-3 pb-6 flex justify-around text-gray-400 relative z-20 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] flex-none">
      <button onClick={() => setView(userRole === 'ADMIN' ? 'HOTEL_SELECT' : 'HOME')} className={`flex flex-col items-center w-16 ${(view === 'HOME' || (userRole === 'ADMIN' && view === 'HOTEL_SELECT')) ? 'text-green-600' : 'hover:text-gray-600'}`}>
        <Home size={26} strokeWidth={(view === 'HOME' || (userRole === 'ADMIN' && view === 'HOTEL_SELECT')) ? 2.5 : 2} />
        <span className={`text-[10px] font-bold mt-1 ${(view === 'HOME' || (userRole === 'ADMIN' && view === 'HOTEL_SELECT')) ? 'opacity-100' : 'opacity-80'}`}>首页</span>
      </button>
      <button onClick={() => setView(userRole === 'ADMIN' ? 'ADMIN_ME' : 'ME')} className={`flex flex-col items-center w-16 ${view.includes('ME') || view.includes('HISTORY') || view.includes('MARKETING') ? 'text-green-600' : 'hover:text-gray-600'}`}>
        <User size={26} strokeWidth={view.includes('ME') ? 2.5 : 2} />
        <span className={`text-[10px] font-bold mt-1 ${view.includes('ME') ? 'opacity-100' : 'opacity-80'}`}>我的</span>
      </button>
    </div>
  );

  const LoginView = () => (
    <div className="min-h-screen flex flex-col justify-center px-8 bg-gray-50">
      <div className="mb-10 text-center">
        <div className="bg-green-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-200">
          <Building className="text-white w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">RoomGuard Pro</h1>
        <p className="text-gray-500 mt-2 text-lg">客房清洁与运维系统</p>
      </div>
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">员工 ID (微信号绑定)</label>
          <input name="employeeId" type="text" className="w-full px-5 py-4 rounded-xl border border-gray-200 outline-none text-lg bg-white focus:ring-2 focus:ring-green-500" placeholder="请输入 ID" defaultValue="1001" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">密码</label>
          <input type="password" className="w-full px-5 py-4 rounded-xl border border-gray-200 outline-none text-lg bg-white focus:ring-2 focus:ring-green-500" placeholder="••••" defaultValue="1234" />
        </div>
        <button type="submit" className="w-full bg-green-600 text-white font-bold py-4 rounded-xl text-lg active:scale-95 shadow-lg shadow-green-200">登录</button>
      </form>
    </div>
  );

  const HotelSelectView = () => {
      const [searchTerm, setSearchTerm] = useState('');
      const filteredHotels = AVAILABLE_HOTELS.filter(h => h.toLowerCase().includes(searchTerm.toLowerCase()));
      return (
          <div className="h-screen w-full bg-gray-50 flex flex-col">
              <div className="bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-none z-10">
                  <div><h1 className="text-2xl font-bold text-gray-800">选择酒店</h1><p className="text-gray-500 text-xs">请选择您要管理的酒店门店</p></div>
                  <LogoutButton />
              </div>
              <div className="px-6 py-3 bg-white border-b border-gray-100 flex-none z-10">
                  <div className="relative">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" placeholder="搜索酒店名称..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-gray-100 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-green-500 transition-all" />
                  </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 grid gap-3 content-start min-h-0">
                  {filteredHotels.map(hotel => (
                    <button key={hotel} onClick={() => { setHotelName(hotel); setView('HOME'); }} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 text-left flex justify-between items-center hover:border-green-500 transition-all active:scale-98 group h-fit">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors"><Building size={20} /></div>
                            <span className="font-bold text-gray-800 text-base">{hotel}</span>
                        </div>
                        <ChevronRight className="text-gray-300 group-hover:text-green-500" />
                    </button>
                  ))}
              </div>
              <BottomNav />
          </div>
      );
  };

  const HomeView = () => {
    const isOps = userRole === 'ADMIN';
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"><Building size={16} className="text-green-700" /></div>
                <div className="flex flex-col">
                    <span className="font-bold text-gray-700 text-sm leading-tight">{hotelName}</span>
                    <span className="text-[10px] text-gray-400 font-medium">{isOps ? '运营模式' : '员工模式'}</span>
                </div>
            </div>
            {isOps && <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center"><LogoutButton /></div>}
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 gap-4 pt-20">
          <div className="text-center mb-2">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">你好，{currentUser?.name}</h2>
            <p className="text-gray-500">{isOps ? '请管理酒店与客房数据' : '准备好开始今天的奖励申请了吗？'}</p>
          </div>
          <div className="w-full max-w-md grid grid-cols-2 gap-4">
              <button onClick={() => setView(isOps ? 'CONFIG' : 'ROOM_ENTRY')} className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center aspect-square border-2 border-white relative active:scale-95 transition-all">
                  <div className={`w-12 h-12 ${isOps ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'} rounded-full flex items-center justify-center mb-3`}>{isOps ? <FilePlus2 size={24} /> : <Plus size={24} />}</div>
                  <span className="text-gray-800 font-bold text-base">{isOps ? '客房运维配置' : '客房运维'}</span>
              </button>
              <button onClick={() => setView(isOps ? 'MARKETING_CONFIG' : 'STAFF_MARKETING')} className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center aspect-square border-2 border-white relative active:scale-95 transition-all">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-3"><Megaphone size={24} /></div>
                  <span className="text-gray-800 font-bold text-base">{isOps ? '全员营销配置' : '全员营销'}</span>
              </button>
              <button onClick={() => setView(isOps ? 'COUPON_CONFIG' : 'STAFF_COUPON')} className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center aspect-square border-2 border-white relative active:scale-95 transition-all">
                  <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-3"><Ticket size={24} /></div>
                  <span className="text-gray-800 font-bold text-base">{isOps ? '升级券配置' : '升级券'}</span>
              </button>
              <button onClick={() => setView(isOps ? 'REVIEW_CONFIG' : 'STAFF_REVIEW')} className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center aspect-square border-2 border-white relative active:scale-95 transition-all">
                  <div className={`w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mb-3`}><Star size={24} /></div>
                  <span className="text-gray-800 font-bold text-base">{isOps ? '好评引导配置' : '好评引导'}</span>
              </button>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  };

  const AdminMeView = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-green-600 px-6 pt-12 pb-24 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
            <div className="relative z-10 flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full border-4 border-white/30 flex items-center justify-center text-white font-bold text-2xl shadow-md ${currentUser?.avatarColor}`}>{currentUser?.name[0]}</div>
                <div className="text-white"><h2 className="text-2xl font-bold">{currentUser?.name}</h2><p className="text-green-50 text-xs mt-1 flex items-center gap-1"><Building size={12} /> {hotelName} • 管理员</p></div>
            </div>
        </div>
        <div className="flex-1 px-4 -mt-12 pb-6 space-y-4 relative z-20">
            <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2"><Settings size={18} className="text-green-600"/> 管理中心</h3>
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setView('MAINTENANCE')} className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100"><Wrench size={20} className="text-orange-500"/><span className="text-xs font-medium">维修工单</span></button>
                    <button onClick={() => setView('HISTORY')} className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100"><ClipboardList size={20} className="text-blue-500"/><span className="text-xs font-medium">巡检记录</span></button>
                    <button disabled className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 bg-gray-200 cursor-not-allowed"><Users size={20} className="text-gray-600"/><span className="text-xs font-medium text-gray-500">人员管理 (筹)</span></button>
                    <button onClick={() => setView('MARKETING_AUDIT')} className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 bg-white"><CheckCheck size={20} className="text-green-600"/><span className="text-xs font-medium text-gray-800">奖励审核</span></button>
                </div>
            </div>
            <button onClick={handleLogout} className="w-full bg-white text-red-500 font-bold py-4 rounded-xl shadow-sm border border-red-100 flex items-center justify-center gap-2">退出登录</button>
        </div>
        <BottomNav />
    </div>
  );

  const MeView = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-green-600 px-6 pt-12 pb-24 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
            <div className="relative z-10 flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full border-4 border-white/30 flex items-center justify-center text-white font-bold text-2xl shadow-md ${currentUser?.avatarColor}`}>{currentUser?.name[0]}</div>
                <div className="text-white"><h2 className="text-2xl font-bold">{currentUser?.name}</h2><p className="text-green-50 text-xs mt-1 flex items-center gap-1"><Building size={12} /> {hotelName}</p></div>
            </div>
        </div>
        <div className="flex-1 px-4 -mt-12 pb-6 space-y-4 relative z-20">
            <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2"><ClipboardList size={18} className="text-green-600"/> 奖励申请记录</h3>
                <div className="grid grid-cols-4 gap-2">
                    <button onClick={() => setView('HISTORY')} className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600"><CheckSquare size={20} /></div>
                        <span className="text-[10px]">客房运维</span>
                    </button>
                    <button onClick={() => { setMarketingHistoryTab('MKT'); setView('MARKETING_HISTORY'); }} className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600"><Megaphone size={20} /></div>
                        <span className="text-[10px]">全员营销</span>
                    </button>
                    <button onClick={() => { setMarketingHistoryTab('CPN'); setView('MARKETING_HISTORY'); }} className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600"><Ticket size={20} /></div>
                        <span className="text-[10px]">升级券</span>
                    </button>
                    <button onClick={() => { setMarketingHistoryTab('RVW'); setView('MARKETING_HISTORY'); }} className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600"><Star size={20} /></div>
                        <span className="text-[10px]">好评引导</span>
                    </button>
                </div>
            </div>
            <button onClick={handleLogout} className="w-full bg-white text-red-500 font-bold py-4 rounded-xl shadow-sm border border-red-100 flex items-center justify-center gap-2">退出登录</button>
        </div>
        <BottomNav />
    </div>
  );

  const MaintenanceView = () => {
    const [filter, setFilter] = useState<'OPEN' | 'RESOLVED'>('OPEN');
    
    // Aggregate issues
    const issues = history.flatMap(insp => 
        Object.entries(insp.steps).flatMap(([stepId, step]) => 
            (step as InspectionStepData).issues.map(issue => ({
                ...issue,
                inspectionId: insp.id,
                roomNumber: insp.roomNumber,
                hotelName: insp.hotelName,
                reportedAt: insp.completedAt,
                areaName: roomTypes.find(t => t.id === insp.roomTypeId)?.items.find(i => i.id === stepId)?.title || stepId
            }))
        )
    ).filter(i => i.type === 'FAULT'); // Only Faults

    const displayIssues = issues.filter(i => i.status === filter);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="bg-white px-4 py-4 border-b border-gray-200 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
                <button onClick={() => setView('ADMIN_ME')} className="p-1 hover:bg-gray-100 rounded-full"><ChevronLeft className="text-gray-800 w-6 h-6" /></button>
                <h2 className="text-lg font-bold text-gray-800">维修工单</h2>
            </div>
            
            <div className="bg-white px-4 pt-2 border-b border-gray-100 flex gap-6">
                <button onClick={() => setFilter('OPEN')} className={`pb-2 text-sm font-bold transition-all relative ${filter === 'OPEN' ? 'text-green-600' : 'text-gray-400'}`}>
                    待处理
                    {filter === 'OPEN' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 rounded-full" />}
                </button>
                <button onClick={() => setFilter('RESOLVED')} className={`pb-2 text-sm font-bold transition-all relative ${filter === 'RESOLVED' ? 'text-green-600' : 'text-gray-400'}`}>
                    已完成
                    {filter === 'RESOLVED' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 rounded-full" />}
                </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {displayIssues.length > 0 ? displayIssues.map(issue => (
                    <div key={issue.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                         <div className="flex justify-between items-start mb-2">
                             <div>
                                 <h4 className="font-bold text-gray-800 text-lg">{issue.roomNumber} <span className="text-sm font-normal text-gray-500">({issue.areaName})</span></h4>
                                 <p className="text-xs text-gray-400">{issue.hotelName} • {issue.reportedAt}</p>
                             </div>
                             <span className={`text-[10px] px-2 py-1 rounded font-bold ${issue.status === 'OPEN' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                 {issue.status === 'OPEN' ? '待维修' : '已维修'}
                             </span>
                         </div>
                         <p className="text-sm text-gray-700 mb-3 bg-gray-50 p-3 rounded-lg">{issue.description}</p>
                         
                         {issue.attachment && (
                             <div className="mb-4">
                                 <img src={issue.attachment} className="w-24 h-24 object-cover rounded-lg border border-gray-200" onClick={() => window.open(issue.attachment)} />
                             </div>
                         )}

                         {issue.status === 'OPEN' && (
                             <button 
                                onClick={() => toggleIssueStatus(issue.inspectionId, issue.id)}
                                className="w-full bg-green-600 text-white font-bold py-3 rounded-xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
                             >
                                 <CheckCircle2 size={18}/> 标记为已修复
                             </button>
                         )}
                    </div>
                )) : (
                    <div className="text-center text-gray-400 py-20">
                        <Wrench size={48} className="mx-auto mb-2 opacity-20" />
                        <p>暂无{filter === 'OPEN' ? '待处理' : '已完成'}工单</p>
                    </div>
                )}
            </div>
            <BottomNav />
        </div>
    );
  };

  const MarketingAuditView = () => {
    const [auditTab, setAuditTab] = useState<'TASKS' | 'ROOMS'>('TASKS');
    const pendingTasks = marketingHistory.filter(t => t.status === 'PENDING');
    const pendingInspections = history.filter(h => h.status === 'PENDING');

    const handleAuditTask = (recordId: string, status: 'APPROVED' | 'REJECTED') => {
        setMarketingHistory(prev => prev.map(t => t.id === recordId ? { ...t, status } : t));
    };

    const handleAuditInspection = (historyId: string, status: 'APPROVED' | 'REJECTED') => {
        setHistory(prev => prev.map(h => h.id === historyId ? { ...h, status } : h));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="bg-white px-4 py-4 border-b border-gray-200 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
                <button onClick={() => setView('ADMIN_ME')} className="p-1 hover:bg-gray-100 rounded-full"><ChevronLeft className="text-gray-800 w-6 h-6" /></button>
                <h2 className="text-lg font-bold text-gray-800">奖励申请审核</h2>
            </div>
            <div className="bg-white px-4 pt-2 border-b border-gray-100 flex gap-6">
                <button onClick={() => setAuditTab('TASKS')} className={`pb-2 text-sm font-bold transition-all relative ${auditTab === 'TASKS' ? 'text-green-600' : 'text-gray-400'}`}>
                    营销/券/好评 {pendingTasks.length > 0 && <span className="absolute -top-1 -right-4 bg-red-500 text-white text-[8px] px-1 rounded-full">{pendingTasks.length}</span>}
                    {auditTab === 'TASKS' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 rounded-full" />}
                </button>
                <button onClick={() => setAuditTab('ROOMS')} className={`pb-2 text-sm font-bold transition-all relative ${auditTab === 'ROOMS' ? 'text-green-600' : 'text-gray-400'}`}>
                    客房运维 {pendingInspections.length > 0 && <span className="absolute -top-1 -right-4 bg-red-500 text-white text-[8px] px-1 rounded-full">{pendingInspections.length}</span>}
                    {auditTab === 'ROOMS' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 rounded-full" />}
                </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {auditTab === 'TASKS' ? (
                    pendingTasks.length > 0 ? pendingTasks.map(item => (
                        <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-gray-800 text-base">{item.taskTitle}</h4>
                                    <p className="text-xs text-gray-400">申请人: {item.userName} • {item.submittedAt}</p>
                                </div>
                                {item.selectedChannel && <span className="text-[10px] bg-pink-50 text-pink-600 px-2 py-0.5 rounded font-bold">渠道: {item.selectedChannel}</span>}
                            </div>
                            <div className="flex gap-2 overflow-x-auto">
                                {item.images.map((img, i) => (
                                    <img key={i} src={img} className="w-20 h-20 object-cover rounded-lg border border-gray-100" onClick={() => window.open(img)} />
                                ))}
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button onClick={() => handleAuditTask(item.id, 'REJECTED')} className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold flex items-center justify-center gap-1"><ThumbsDown size={14} /> 驳回</button>
                                <button onClick={() => handleAuditTask(item.id, 'APPROVED')} className="flex-1 py-2 bg-green-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1"><ThumbsUp size={14} /> 通过</button>
                            </div>
                        </div>
                    )) : <div className="text-center text-gray-400 py-20"><CheckCircle2 size={48} className="mx-auto mb-2 opacity-20" /><p>暂无待审核任务</p></div>
                ) : (
                    pendingInspections.length > 0 ? pendingInspections.map(item => (
                        <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
                             <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-gray-800 text-base">{item.roomNumber} 房巡检奖励</h4>
                                    <p className="text-xs text-gray-400">巡检员ID: {item.userId} • {item.completedAt}</p>
                                </div>
                                <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold">{roomTypes.find(t => t.id === item.roomTypeId)?.name}</span>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button onClick={() => handleAuditInspection(item.id, 'REJECTED')} className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold flex items-center justify-center gap-1"><ThumbsDown size={14} /> 驳回</button>
                                <button onClick={() => handleAuditInspection(item.id, 'APPROVED')} className="flex-1 py-2 bg-green-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1"><ThumbsUp size={14} /> 通过</button>
                                <button onClick={() => viewHistoryDetail(item)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">查看详情</button>
                            </div>
                        </div>
                    )) : <div className="text-center text-gray-400 py-20"><CheckCircle2 size={48} className="mx-auto mb-2 opacity-20" /><p>暂无待审核巡检</p></div>
                )}
            </div>
            <BottomNav />
        </div>
    );
  };

  const MarketingHistoryView = () => {
    const filteredHistory = marketingHistory.filter(item => {
        if (!currentUser || item.userId !== currentUser.id) return false;
        if (marketingHistoryTab === 'MKT' && !item.taskId.startsWith('mkt_')) return false;
        if (marketingHistoryTab === 'CPN' && !item.taskId.startsWith('cpn_')) return false;
        if (marketingHistoryTab === 'RVW' && !item.taskId.startsWith('rvw_')) return false;
        return true;
    });

    const getStatusText = (status: string) => {
        switch (status) {
            case 'PENDING': return '审核中';
            case 'APPROVED': return '奖励已发放';
            case 'REJECTED': return '未通过';
            default: return '未知';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-amber-100 text-amber-700';
            case 'APPROVED': return 'bg-green-100 text-green-700';
            case 'REJECTED': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getCategoryIcon = (taskId: string) => {
        if (taskId.startsWith('mkt_')) return <Megaphone size={14} className="text-indigo-600" />;
        if (taskId.startsWith('cpn_')) return <Ticket size={14} className="text-amber-600" />;
        if (taskId.startsWith('rvw_')) return <Star size={14} className="text-pink-600" />;
        return <HelpCircle size={14} />;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="bg-white px-4 py-4 border-b border-gray-200 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
                <button onClick={() => setView('ME')} className="p-1 hover:bg-gray-100 rounded-full"><ChevronLeft className="text-gray-800 w-6 h-6" /></button>
                <h2 className="text-lg font-bold text-gray-800">奖励申请记录</h2>
            </div>
            <div className="bg-white p-2 border-b border-gray-100 flex gap-2 overflow-x-auto no-scrollbar">
                <button onClick={() => setMarketingHistoryTab('ALL')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${marketingHistoryTab === 'ALL' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-500'}`}>全部</button>
                <button onClick={() => setMarketingHistoryTab('MKT')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${marketingHistoryTab === 'MKT' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-500'}`}>全员营销</button>
                <button onClick={() => setMarketingHistoryTab('CPN')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${marketingHistoryTab === 'CPN' ? 'bg-amber-500 text-white shadow-md' : 'bg-gray-100 text-gray-500'}`}>升级券</button>
                <button onClick={() => setMarketingHistoryTab('RVW')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${marketingHistoryTab === 'RVW' ? 'bg-pink-500 text-white shadow-md' : 'bg-gray-100 text-gray-500'}`}>好评引导</button>
            </div>
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                {filteredHistory.length > 0 ? filteredHistory.map(item => (
                    <button key={item.id} onClick={() => { setSelectedMarketingRecord(item); setView('MARKETING_DETAIL'); }} className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col gap-2 text-left active:scale-98 transition-all relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-gray-50 rounded-lg">{getCategoryIcon(item.taskId)}</div>
                                <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{item.taskTitle}</h4>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusColor(item.status)}`}>
                                {getStatusText(item.status)}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] text-gray-400 mt-1">
                            <span className="flex items-center gap-1"><Clock size={10} /> {item.submittedAt}</span>
                            <span className="flex items-center gap-1"><ImageIcon size={10} /> {item.images.length} 张凭证</span>
                        </div>
                        <ChevronRight className="absolute right-2 bottom-4 text-gray-300 w-4 h-4" />
                    </button>
                )) : (
                    <div className="text-center text-gray-400 py-20">
                        <History size={48} className="mx-auto mb-2 opacity-20" />
                        <p>暂无相关奖励申请记录</p>
                    </div>
                )}
            </div>
            <BottomNav />
        </div>
    );
  };

  const MarketingDetailView = () => {
    if (!selectedMarketingRecord) return null;
    const record = selectedMarketingRecord;
    
    const getStatusText = (status: string) => {
        switch (status) {
            case 'PENDING': return '审核中';
            case 'APPROVED': return '奖励已发放';
            case 'REJECTED': return '未通过';
            default: return '未知';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-amber-100 text-amber-700';
            case 'APPROVED': return 'bg-green-100 text-green-700';
            case 'REJECTED': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="bg-white px-4 py-4 border-b border-gray-200 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
                <button onClick={() => setView('MARKETING_HISTORY')} className="p-1 hover:bg-gray-100 rounded-full"><ChevronLeft className="text-gray-800 w-6 h-6" /></button>
                <h2 className="text-lg font-bold text-gray-800">申请详情</h2>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                    <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-gray-800 leading-tight">{record.taskTitle}</h3>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusColor(record.status)}`}>{getStatusText(record.status)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1"><p className="text-gray-400 font-medium">提交时间</p><p className="text-gray-800 font-bold">{record.submittedAt}</p></div>
                        {record.selectedChannel && <div className="space-y-1"><p className="text-gray-400 font-medium">发布渠道</p><p className="text-pink-600 font-bold">{record.selectedChannel}</p></div>}
                    </div>
                    {record.userRemarks && (
                        <div className="bg-gray-50 p-3 rounded-xl"><p className="text-[10px] text-gray-400 mb-1 font-bold uppercase">提交备注</p><p className="text-sm text-gray-700 leading-relaxed">{record.userRemarks}</p></div>
                    )}
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-3">
                    <h4 className="text-sm font-bold text-gray-800">图片凭证</h4>
                    <div className="grid grid-cols-2 gap-3">
                        {record.images.map((img, idx) => (
                            <img key={idx} src={img} className="w-full aspect-[3/4] object-cover rounded-xl border border-gray-100" onClick={() => window.open(img)} />
                        ))}
                    </div>
                </div>
            </div>
            <BottomNav />
        </div>
    );
  };

  const HistoryListView = () => {
    const [searchRoom, setSearchRoom] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'ISSUES' | 'NORMAL'>('ALL');

    const filteredHistory = history.filter(item => {
      let match = true;
      if (historyFilterHotel && item.hotelName !== historyFilterHotel) match = false;
      if (historyStartDate && item.completedAt < historyStartDate) match = false; 
      if (historyEndDate && item.completedAt > historyEndDate) match = false;
      if (userRole !== 'ADMIN' && item.userId !== currentUser?.id) match = false;
      
      // Room number search
      if (searchRoom && !item.roomNumber.includes(searchRoom)) match = false;

      // Status Filter
      const hasIssues = Object.values(item.steps).some(step => (step as InspectionStepData).issues.length > 0);
      if (statusFilter === 'ISSUES' && !hasIssues) match = false;
      if (statusFilter === 'NORMAL' && hasIssues) match = false;

      return match;
    });

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'PENDING': return { text: '待审核', color: 'text-amber-500' };
            case 'APPROVED': return { text: '审核通过', color: 'text-green-500' };
            case 'REJECTED': return { text: '已驳回', color: 'text-red-500' };
            default: return { text: '正常', color: 'text-green-500' };
        }
    }

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-white px-4 py-4 border-b border-gray-200 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
           <button onClick={() => setView(userRole === 'ADMIN' ? 'ADMIN_ME' : 'ME')} className="p-1 hover:bg-gray-100 rounded-full"><ChevronLeft className="text-gray-800 w-6 h-6" /></button>
           <h2 className="text-lg font-bold text-gray-800">巡检奖励记录</h2>
        </div>

        <div className="p-4 bg-white border-b border-gray-100 space-y-3">
             {/* Hotel Select (Admin Only) */}
             {userRole === 'ADMIN' && <SearchableHotelSelect selectedHotel={historyFilterHotel} onSelect={setHistoryFilterHotel} placeholder="筛选酒店门店" />}
             
             {/* Room Search */}
             <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  value={searchRoom}
                  onChange={(e) => setSearchRoom(e.target.value)}
                  placeholder="搜索房号..."
                  className="w-full bg-gray-50 rounded-lg py-2 pl-9 pr-2 text-sm outline-none focus:ring-1 focus:ring-green-500 border border-gray-100"
                />
             </div>

             {/* Classification Filter (Tabs) */}
             <div className="flex bg-gray-100 p-1 rounded-xl">
                <button 
                  onClick={() => setStatusFilter('ALL')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === 'ALL' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400'}`}
                >
                  全部
                </button>
                <button 
                  onClick={() => setStatusFilter('ISSUES')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === 'ISSUES' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-400'}`}
                >
                  仅异常
                </button>
                <button 
                  onClick={() => setStatusFilter('NORMAL')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === 'NORMAL' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400'}`}
                >
                  仅正常
                </button>
             </div>

             <div className="flex gap-2">
                 <div className="relative flex-1">
                     <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                     <input type="date" value={historyStartDate} onChange={e => setHistoryStartDate(e.target.value)} className="w-full bg-gray-50 rounded-lg py-2 pl-9 pr-2 text-xs outline-none focus:ring-1 focus:ring-green-500 border border-gray-100" />
                 </div>
                 <div className="relative flex-1">
                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="date" value={historyEndDate} onChange={e => setHistoryEndDate(e.target.value)} className="w-full bg-gray-50 rounded-lg py-2 pl-9 pr-2 text-xs outline-none focus:ring-1 focus:ring-green-500 border border-gray-100" />
                 </div>
             </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {filteredHistory.length > 0 ? filteredHistory.map(item => {
                const s = getStatusInfo(item.status);
                const hasIssues = Object.values(item.steps).some(step => (step as InspectionStepData).issues.length > 0);
                
                return (
                    <button key={item.id} onClick={() => viewHistoryDetail(item)} className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex justify-between items-center text-left active:scale-[0.98] transition-all">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-xl text-gray-800">{item.roomNumber}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${hasIssues ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                    {hasIssues ? '发现异常' : '状态正常'}
                                </span>
                            </div>
                            <div className="text-[11px] text-gray-500 font-medium mb-1 flex items-center gap-1.5">
                                <Building size={12} className="text-gray-400" />
                                {item.hotelName}
                            </div>
                            <div className="text-[10px] text-gray-400 flex items-center gap-3">
                                <span className="flex items-center gap-1"><Clock size={11} /> {item.completedAt}</span>
                                <span className={`font-bold ${s.color}`}>{s.text}</span>
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-gray-300 ml-2" />
                    </button>
                )
            }) : (
                <div className="text-center text-gray-400 py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                    <ClipboardList size={48} className="mx-auto mb-3 opacity-20" />
                    <p className="text-sm">未找到符合条件的巡检记录</p>
                    {(searchRoom || statusFilter !== 'ALL') && (
                      <button onClick={() => { setSearchRoom(''); setStatusFilter('ALL'); }} className="text-green-600 text-xs mt-2 font-bold underline">重置所有筛选</button>
                    )}
                </div>
            )}
        </div>
        <BottomNav />
      </div>
    );
  };

  const GenericStaffTaskView = ({ title, tasks, onBack, category }: { title: string, tasks: (MarketingTask | CouponTask | ReviewTask)[], onBack: () => void, category: string }) => {
    const [uploadMap, setUploadMap] = useState<Record<string, string[]>>({});
    const [selectedChannelMap, setSelectedChannelMap] = useState<Record<string, string>>({});
    const [expandedExamples, setExpandedExamples] = useState<Record<string, boolean>>({});
    const [userRemarks, setUserRemarks] = useState<Record<string, string>>({});

    const toggleExpand = (id: string) => {
        setExpandedExamples(prev => ({...prev, [id]: !prev[id]}));
    };

    const handleUpload = (taskId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            Array.from(e.target.files).forEach((file: File) => {
                const reader = new FileReader();
                reader.onload = (ev) => setUploadMap(prev => ({ ...prev, [taskId]: [...(prev[taskId] || []), ev.target?.result as string] }));
                reader.readAsDataURL(file);
            });
        }
    };

    const submitTask = (task: MarketingTask | CouponTask | ReviewTask) => {
        const uploads = uploadMap[task.id] || [];
        const remarks = userRemarks[task.id] || '';
        
        let channel: string | undefined = undefined;
        // Type guard or property check for ReviewTask
        if ('channels' in task && task.channels) {
            channel = selectedChannelMap[task.id];
            if (!channel) {
                alert("请选择评价渠道");
                return;
            }
        }

        if (uploads.length === 0) {
             alert("请先上传凭证截图");
             return;
        }

        if (currentUser) {
            const newRecord: CompletedMarketingTask = {
                id: Date.now().toString(),
                taskId: task.id,
                taskTitle: task.title,
                submittedAt: new Date().toLocaleString('zh-CN', { hour12: false }),
                images: uploads,
                status: 'PENDING',
                userId: currentUser.id,
                userName: currentUser.name,
                userAvatarColor: currentUser.avatarColor,
                notes: task.notes,
                userRemarks: remarks,
                selectedChannel: channel
            };
            setMarketingHistory(prev => [newRecord, ...prev]);
            alert("提交成功！管理员将审核您的奖励申请。");
            setUploadMap(prev => ({ ...prev, [task.id]: [] }));
            setUserRemarks(prev => {
                const n = {...prev};
                delete n[task.id];
                return n;
            });
            setSelectedChannelMap(prev => {
                const n = {...prev};
                delete n[task.id];
                return n;
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="bg-white px-4 py-4 border-b border-gray-200 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
                <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-full"><ChevronLeft className="text-gray-800 w-6 h-6" /></button>
                <h2 className="text-lg font-bold text-gray-800">{title}</h2>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
                {tasks.length > 0 ? tasks.map(task => {
                    const uploads = uploadMap[task.id] || [];
                    const isReviewTask = 'channels' in task && !!task.channels;
                    const channels = isReviewTask ? (task as ReviewTask).channels.split(',').map(s => s.trim()) : [];
                    const isExpanded = expandedExamples[task.id];

                    return (
                        <div key={task.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                            {/* Header: Title only, Reward hidden */}
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-bold text-gray-800 text-lg leading-tight flex-1 mr-2">{task.title}</h3>
                            </div>

                            {/* Description Box */}
                            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 mb-4 leading-relaxed">
                                {task.description}
                            </div>
                            
                            {/* Review Channel Selector */}
                            {isReviewTask && (
                                <div className="mb-4">
                                    <label className="text-xs font-bold text-gray-700 block mb-2">选择发布渠道:</label>
                                    <div className="flex flex-wrap gap-2">
                                        {channels.map(ch => (
                                            <button 
                                                key={ch}
                                                onClick={() => setSelectedChannelMap(prev => ({...prev, [task.id]: ch}))}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${selectedChannelMap[task.id] === ch ? 'bg-pink-50 border-pink-500 text-pink-600' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                                            >
                                                {ch}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Merged Upload Section: Upload + Examples */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-sm font-bold text-gray-700">上传PMS截图申请奖励</span>
                                    {task.images && task.images.length > 0 && (
                                        <button 
                                            onClick={() => toggleExpand(task.id)}
                                            className="text-blue-600 text-xs font-medium flex items-center gap-1 active:opacity-70"
                                        >
                                            {isExpanded ? '收起' : '查看示例'} <Eye size={14} />
                                        </button>
                                    )}
                                </div>

                                {/* Examples (Hidden by default) */}
                                {isExpanded && task.images && task.images.length > 0 && (
                                    <div className="mb-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                                        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                                            {task.images.map((img, i) => (
                                                <img key={i} src={img} className="w-24 h-24 object-cover rounded-lg border border-blue-200 flex-shrink-0" onClick={() => window.open(img)}/>
                                            ))}
                                        </div>
                                        <p className="text-[10px] text-blue-400 mt-1 text-center">示例图片</p>
                                    </div>
                                )}
                                
                                <div className="flex flex-wrap gap-3 mb-3">
                                    {/* Upload Button */}
                                    <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer">
                                        <Upload size={24} className="mb-1 text-gray-300" />
                                        <span className="text-xs font-medium">上传</span>
                                        <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleUpload(task.id, e)} />
                                    </label>

                                    {/* Thumbnails */}
                                    {uploads.map((img, idx) => (
                                        <div key={idx} className="w-24 h-24 relative rounded-xl overflow-hidden border border-gray-200 group">
                                            <img src={img} className="w-full h-full object-cover" />
                                            <button onClick={() => setUploadMap(prev => ({...prev, [task.id]: prev[task.id].filter((_, i) => i !== idx)}))} className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full backdrop-blur-sm"><X size={12}/></button>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Remarks Field */}
                                <textarea 
                                    value={userRemarks[task.id] || ''} 
                                    onChange={(e) => setUserRemarks(prev => ({...prev, [task.id]: e.target.value}))}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-green-500 min-h-[80px]"
                                    placeholder="添加备注..."
                                />
                            </div>

                            {/* Submit Button - Only visible if images selected */}
                            {uploads.length > 0 && (
                                <div className="mt-5 pt-4 border-t border-gray-100">
                                    <button onClick={() => submitTask(task)} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl shadow-md active:scale-95 transition-all">提交奖励申请</button>
                                </div>
                            )}
                        </div>
                    );
                }) : (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400 opacity-60">
                        <Archive size={48} className="mb-4" />
                        <p className="text-sm">暂无正在进行的任务</p>
                    </div>
                )}
            </div>
            <BottomNav />
        </div>
    );
  };

  const RoomConfigView = () => {
    // Local state for modals and form inputs
    const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [isRoomSelectOpen, setIsRoomSelectOpen] = useState(false);
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    
    // Inputs
    const [newTypeName, setNewTypeName] = useState('');
    
    const [newItem, setNewItem] = useState<{title: string; description: string; referenceImage: string}>({
        title: '',
        description: '',
        referenceImage: ''
    });

    const roomSelectRef = useRef<HTMLDivElement>(null);
    const selectedType = roomTypes.find(t => t.id === activeTypeId);
    const currentRooms = managedRooms.filter(r => r.typeId === activeTypeId);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (roomSelectRef.current && !roomSelectRef.current.contains(event.target as Node)) {
            setIsRoomSelectOpen(false);
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleAddRoomType = () => {
        if (!newTypeName.trim()) return;
        const newId = `type_${Date.now()}`;
        const newType: RoomTypeDefinition = { id: newId, name: newTypeName, items: [] };
        setRoomTypes(prev => [...prev, newType]);
        setActiveTypeId(newId);
        setNewTypeName('');
        setIsTypeModalOpen(false);
    };

    const handleDeleteRoomType = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (roomTypes.length <= 1) {
            alert("至少保留一个房型");
            return;
        }
        if (confirm("确定删除该房型吗？关联的房间也将被删除。")) {
            setRoomTypes(prev => prev.filter(t => t.id !== id));
            setManagedRooms(prev => prev.filter(r => r.number !== id));
            if (activeTypeId === id) {
                setActiveTypeId(roomTypes.find(t => t.id !== id)?.id || '');
            }
        }
    };

    const toggleRoomSelection = (roomNum: string) => {
        const isCurrentlyAssignedToThis = managedRooms.some(r => r.number === roomNum && r.typeId === activeTypeId);
        
        if (isCurrentlyAssignedToThis) {
            // Remove it
            setManagedRooms(prev => prev.filter(r => r.number !== roomNum));
        } else {
            // Add it or Move it
            setManagedRooms(prev => {
                const filtered = prev.filter(r => r.number !== roomNum);
                return [...filtered, { number: roomNum, typeId: activeTypeId }];
            });
        }
    };

    const handleRemoveRoom = (num: string) => {
        setManagedRooms(prev => prev.filter(r => r.number !== num));
    };

    const handleSaveItem = () => {
        if (!newItem.title.trim()) return;
        
        setRoomTypes(prev => prev.map(t => {
            if (t.id === activeTypeId) {
                if (editingItemId) {
                     // Update existing
                     return {
                        ...t,
                        items: t.items.map(i => i.id === editingItemId ? {
                            ...i,
                            title: newItem.title,
                            description: newItem.description || '无描述',
                            referenceImage: newItem.referenceImage || i.referenceImage,
                            // Keep existing category or default to MATERIAL
                            category: i.category 
                        } : i)
                    };
                } else {
                    // Add new
                    return {
                        ...t,
                        items: [...t.items, {
                            id: `item_${Date.now()}`,
                            title: newItem.title,
                            category: 'MATERIAL', // Default
                            description: newItem.description || '无描述',
                            referenceImage: newItem.referenceImage || 'https://picsum.photos/400/300'
                        }]
                    };
                }
            }
            return t;
        }));
        setNewItem({ title: '', description: '', referenceImage: '' });
        setEditingItemId(null);
        setIsItemModalOpen(false);
    };

    const handleRemoveItem = (itemId: string) => {
        if(!confirm("确定删除该检查项吗？")) return;
        setRoomTypes(prev => prev.map(t => {
            if (t.id === activeTypeId) {
                return { ...t, items: t.items.filter(i => i.id !== itemId) };
            }
            return t;
        }));
    };

    const openEditModal = (item: CheckItemDefinition) => {
        setNewItem({
            title: item.title,
            description: item.description,
            referenceImage: item.referenceImage
        });
        setEditingItemId(item.id);
        setIsItemModalOpen(true);
    };

    const openAddModal = () => {
        setNewItem({ title: '', description: '', referenceImage: '' });
        setEditingItemId(null);
        setIsItemModalOpen(true);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setNewItem(prev => ({ ...prev, referenceImage: ev.target?.result as string }));
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white px-4 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={() => setView('HOME')} className="p-1 hover:bg-gray-100 rounded-full">
                        <ChevronLeft className="text-gray-800 w-6 h-6" />
                    </button>
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">客房运维配置</h2>
                        <p className="text-xs text-gray-500">{hotelName}</p>
                    </div>
                </div>
                <button 
                    onClick={() => setIsTypeModalOpen(true)}
                    className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-1.5 rounded-lg text-xs font-bold active:scale-95 transition-all"
                >
                    <Plus size={14} /> 新增房型
                </button>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b border-gray-100 overflow-x-auto no-scrollbar">
                <div className="flex px-4 gap-6 min-w-max">
                    {roomTypes.map(type => (
                        <div key={type.id} className="relative group">
                            <button 
                                onClick={() => setActiveTypeId(type.id)}
                                className={`py-3 text-sm font-bold transition-all relative ${activeTypeId === type.id ? 'text-green-600' : 'text-gray-400'}`}
                            >
                                {type.name}
                                {activeTypeId === type.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 rounded-full" />}
                            </button>
                            {/* Delete Type Button (Small 'x') */}
                            {activeTypeId === type.id && (
                                <button 
                                    onClick={(e) => handleDeleteRoomType(e, type.id)}
                                    className="absolute -top-1 -right-3 text-gray-300 hover:text-red-500 p-1"
                                >
                                    <X size={10} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto pb-24 space-y-4">
                {/* Room Distribution Section */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Home size={18} className="text-green-600" />
                            <h3 className="font-bold text-gray-800">房型分配 ({currentRooms.length})</h3>
                        </div>
                        <div className="text-[10px] bg-green-50 text-green-600 px-2 py-1 rounded-full font-bold">
                            {hotelName}
                        </div>
                    </div>

                    {/* Assigned Room Chips (Displayed ABOVE the selector) */}
                    <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        {currentRooms.length > 0 ? currentRooms.map(room => (
                            <div key={room.number} className="bg-white text-green-700 px-3 py-1.5 rounded-lg text-sm font-bold border border-green-200 flex items-center gap-2 shadow-sm animate-in zoom-in-95">
                                {room.number}
                                <button onClick={() => handleRemoveRoom(room.number)} className="text-gray-300 hover:text-red-500 transition-colors"><X size={14} /></button>
                            </div>
                        )) : (
                            <div className="w-full flex items-center justify-center text-[10px] text-gray-400 italic py-2">
                                尚未分配房间给此房型
                            </div>
                        )}
                    </div>

                    {/* Fixed Room Multi-Select Dropdown */}
                    <div className="relative" ref={roomSelectRef}>
                        <button 
                            type="button"
                            onClick={() => setIsRoomSelectOpen(!isRoomSelectOpen)}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 flex justify-between items-center text-sm group hover:border-green-500 transition-all active:scale-[0.99]"
                        >
                            <span className="text-gray-500 font-medium">选择房间号进行分配...</span>
                            <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${isRoomSelectOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isRoomSelectOpen && (
                            <div className="absolute z-30 mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="p-3 border-b border-gray-50 text-[10px] text-gray-400 font-bold uppercase tracking-wider">可用房间列表</div>
                                <div className="max-h-60 overflow-y-auto p-2 grid grid-cols-2 gap-2">
                                    {FIXED_ROOM_NUMBERS.map(roomNum => {
                                        const assignedToType = managedRooms.find(r => r.number === roomNum)?.typeId;
                                        const isSelected = assignedToType === activeTypeId;
                                        const otherType = assignedToType && assignedToType !== activeTypeId ? roomTypes.find(t => t.id === assignedToType)?.name : null;

                                        return (
                                            <button 
                                                key={roomNum}
                                                onClick={() => toggleRoomSelection(roomNum)}
                                                className={`flex items-center justify-between p-3 rounded-xl border text-sm font-bold transition-all ${isSelected ? 'bg-green-600 border-green-600 text-white' : 'bg-gray-50 border-gray-100 text-gray-700 hover:border-green-200 hover:bg-white'}`}
                                            >
                                                <div className="flex flex-col items-start">
                                                    <span>{roomNum}</span>
                                                    {otherType && !isSelected && <span className="text-[8px] font-normal opacity-60">已分配: {otherType}</span>}
                                                </div>
                                                {isSelected && <Check size={16} />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                    <p className="text-[10px] text-gray-400 text-center">每个房间只能分配给一种房型，重新选择将自动更新分配。</p>
                </div>

                {/* Check Items Section */}
                <div className="space-y-3">
                    <div className="flex justify-between items-end px-1">
                        <div className="flex items-center gap-2">
                            <ClipboardCheck size={18} className="text-gray-400" />
                            <h3 className="font-bold text-gray-800">巡检区域示例配置</h3>
                        </div>
                        <button onClick={openAddModal} className="text-green-600 p-1 hover:bg-green-50 rounded"><Plus size={20} /></button>
                    </div>

                    {selectedType?.items.length === 0 ? (
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400 bg-white">
                            <p className="text-sm">暂无巡检区域，请添加</p>
                        </div>
                    ) : (
                        selectedType?.items.map(item => (
                            <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-3">
                                <img src={item.referenceImage} className="w-20 h-20 object-cover rounded-lg bg-gray-100 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-gray-800 truncate">{item.title}</h4>
                                        <div className="flex gap-1">
                                            <button onClick={() => openEditModal(item)} className="text-gray-300 hover:text-blue-500 p-1"><Edit2 size={16} /></button>
                                            <button onClick={() => handleRemoveItem(item.id)} className="text-gray-300 hover:text-red-500 p-1"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded mt-1 inline-block">
                                        {item.category === 'MATERIAL' ? '物料' : '设备'}
                                    </span>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Add Type Modal */}
            {isTypeModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-xs rounded-2xl p-5 shadow-2xl">
                        <h3 className="font-bold text-gray-800 mb-3">新增房型</h3>
                        <input 
                            value={newTypeName}
                            onChange={e => setNewTypeName(e.target.value)}
                            placeholder="例如: 豪华江景房"
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-green-500 mb-4"
                        />
                        <div className="flex gap-2">
                            <button onClick={() => setIsTypeModalOpen(false)} className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl text-sm font-bold">取消</button>
                            <button onClick={handleAddRoomType} className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-bold">确认</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Item Modal */}
            {isItemModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-xs rounded-2xl p-5 shadow-2xl space-y-3 max-h-[90vh] overflow-y-auto">
                        <h3 className="font-bold text-gray-800 mb-1">{editingItemId ? '编辑' : '新增'}巡检区域</h3>
                        <div>
                            <label className="text-xs text-gray-500 font-bold">区域名称</label>
                            <input 
                                value={newItem.title}
                                onChange={e => setNewItem({...newItem, title: e.target.value})}
                                placeholder="例如: 卫生间"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-green-500 mt-1"
                            />
                        </div>
                        
                        {/* Reference Image Upload */}
                        <div>
                            <label className="text-xs text-gray-500 font-bold mb-1 block">示例示意图</label>
                            <div className="flex gap-3 items-end">
                                {newItem.referenceImage && (
                                    <img src={newItem.referenceImage} className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
                                )}
                                <label className="bg-gray-50 text-gray-500 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold flex items-center gap-1 active:bg-gray-100 cursor-pointer">
                                    <Upload size={14} /> {newItem.referenceImage ? '更换图片' : '上传图片'}
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 font-bold">检查说明</label>
                            <textarea 
                                value={newItem.description}
                                onChange={e => setNewItem({...newItem, description: e.target.value})}
                                placeholder="简要描述检查要点..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-green-500 mt-1 h-20 resize-none"
                            />
                        </div>
                        <div className="flex gap-2 pt-2">
                            <button onClick={() => setIsItemModalOpen(false)} className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl text-sm font-bold">取消</button>
                            <button onClick={handleSaveItem} className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-bold">保存</button>
                        </div>
                    </div>
                </div>
            )}

            <BottomNav />
        </div>
    );
  };

  const GenericTaskConfigView = ({ title, tasks, setTasks, type }: { title: string, tasks: any[], setTasks: React.Dispatch<React.SetStateAction<any[]>>, type: 'MARKETING' | 'COUPON' | 'REVIEW' }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [taskImages, setTaskImages] = useState<string[]>([]);
    
    const [formData, setFormData] = useState<Partial<ReviewTask>>({
        title: '',
        description: '',
        rewardAmount: '',
        notes: '',
        channels: ''
    });
    
    const [expandedExamples, setExpandedExamples] = useState<Record<string, boolean>>({});

    const toggleExpand = (id: string) => {
        setExpandedExamples(prev => ({...prev, [id]: !prev[id]}));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            Array.from(e.target.files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    setTaskImages(prev => [...prev, ev.target?.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        setTaskImages(prev => prev.filter((_, i) => i !== index));
    };

    const openCreateModal = () => {
        setEditingTaskId(null);
        setTaskImages([]);
        setFormData({ title: '', description: '', rewardAmount: '', notes: '', channels: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (task: MarketingTask | ReviewTask) => {
        setEditingTaskId(task.id);
        setTaskImages(task.images || []);
        setFormData({
            title: task.title,
            description: task.description,
            rewardAmount: task.rewardAmount,
            notes: task.notes,
            channels: (task as ReviewTask).channels || ''
        });
        setIsModalOpen(true);
    };

    const handleSaveTask = () => {
        if(!formData.title) return;

        if (editingTaskId) {
            setTasks(prev => prev.map(t => t.id === editingTaskId ? {
                ...t,
                ...formData,
                images: taskImages
            } : t));
        } else {
            const newTask = {
                ...formData,
                id: `${type.toLowerCase()}_${Date.now()}`,
                status: 'ACTIVE',
                createdAt: new Date().toLocaleDateString(),
                images: taskImages
            };
            setTasks(prev => [...prev, newTask]);
        }
        setIsModalOpen(false);
    };

    const toggleStatus = (id: string) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE' } : t));
    };

    const deleteTask = (id: string) => {
        if(confirm("确定删除该任务吗？")) {
            setTasks(prev => prev.filter(t => t.id !== id));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="bg-white px-4 py-4 border-b border-gray-200 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
                <button onClick={() => setView('HOME')} className="p-1 hover:bg-gray-100 rounded-full"><ChevronLeft className="text-gray-800 w-6 h-6" /></button>
                <h2 className="text-lg font-bold text-gray-800">{title}</h2>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto pb-24 space-y-4 bg-gray-50">
                {tasks.map(task => {
                    const isExpanded = expandedExamples[task.id];
                    return (
                    <div key={task.id} className={`bg-white p-5 rounded-xl border ${task.status === 'ACTIVE' ? 'border-green-200 shadow-sm' : 'border-gray-200 opacity-60'}`}>
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="font-bold text-gray-800 text-lg leading-tight flex-1 mr-2">{task.title}</h3>
                            <div className="flex gap-2 items-center">
                                <div className="flex gap-1 ml-2">
                                    <button onClick={() => openEditModal(task)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                                        <Edit2 size={16}/>
                                    </button>
                                    <button onClick={() => toggleStatus(task.id)} className={`p-1.5 rounded-lg ${task.status === 'ACTIVE' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                        <Eye size={16}/>
                                    </button>
                                    <button onClick={() => deleteTask(task.id)} className="p-1.5 bg-red-50 text-red-500 rounded-lg"><Trash2 size={16}/></button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 mb-4 leading-relaxed">
                            {task.description}
                        </div>

                        <div className="mb-2">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-gray-700">参考示例 (示例图片)</span>
                                {task.images && task.images.length > 0 && (
                                    <button 
                                        onClick={() => toggleExpand(task.id)}
                                        className="text-blue-600 text-xs font-medium flex items-center gap-1 active:opacity-70"
                                    >
                                        {isExpanded ? '收起' : '展开查看'} <Eye size={14} />
                                    </button>
                                )}
                            </div>
                            {isExpanded && task.images && task.images.length > 0 && (
                                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                    {task.images.map((img: string, i: number) => (
                                        <img key={i} src={img} className="w-24 h-24 object-cover rounded-lg border border-gray-100 flex-shrink-0" onClick={() => window.open(img)}/>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {task.channels && (
                            <div className="mt-3 pt-3 border-t border-gray-50">
                                <span className="bg-pink-50 text-pink-600 px-2 py-1 rounded text-xs font-bold">渠道: {task.channels}</span>
                            </div>
                        )}
                    </div>
                )})}
            </div>

            <div className="fixed bottom-24 right-4">
                <button onClick={openCreateModal} className="w-14 h-14 bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform"><Plus size={28}/></button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="bg-white w-full max-md rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">{editingTaskId ? '编辑' : '新建'}任务</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 block mb-1">任务标题</label>
                                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-gray-50 p-3 rounded-lg border border-gray-200" placeholder="例如: 10月全员营销活动" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 block mb-1">任务描述</label>
                                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-50 p-3 rounded-lg border border-gray-200 h-20" placeholder="简要描述任务内容..." />
                            </div>
                            
                            {/* Image Upload Section */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 block mb-2">上传示例图片 (支持多图)</label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {taskImages.map((img, idx) => (
                                        <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 group">
                                            <img src={img} className="w-full h-full object-cover" />
                                            <button onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"><X size={10}/></button>
                                        </div>
                                    ))}
                                    <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                                        <Plus size={20} className="text-gray-400" />
                                        <span className="text-[10px] text-gray-400">添加</span>
                                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">奖励规则 (不在外层显示)</label>
                                    <input type="text" value={formData.rewardAmount} onChange={e => setFormData({...formData, rewardAmount: e.target.value})} className="w-full bg-gray-50 p-3 rounded-lg border border-gray-200" placeholder="例如: 20元/单 (配置规则)" />
                                </div>
                                {type === 'REVIEW' && (
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 block mb-1">指定渠道</label>
                                        <input type="text" value={formData.channels} onChange={e => setFormData({...formData, channels: e.target.value})} className="w-full bg-gray-50 p-3 rounded-lg border border-gray-200" placeholder="携程, 美团..." />
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 block mb-1">备注/审核要求</label>
                                <input type="text" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full bg-gray-50 p-3 rounded-lg border border-gray-200" placeholder="例如: 需包含订单号截图" />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 pt-4">
                                <button onClick={() => setIsModalOpen(false)} className="bg-gray-100 text-gray-600 font-bold py-3 rounded-xl">取消</button>
                                <button onClick={handleSaveTask} className="bg-green-600 text-white font-bold py-3 rounded-xl">{editingTaskId ? '保存修改' : '发布任务'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <BottomNav />
        </div>
    );
  };

  const RoomEntryView = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col">
       <div className="bg-white px-4 py-4 border-b border-gray-200 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
           <button onClick={() => setView('HOME')} className="p-1 hover:bg-gray-100 rounded-full"><ChevronLeft className="text-gray-800 w-6 h-6" /></button>
           <h2 className="text-lg font-bold text-gray-800">选择客房</h2>
       </div>
       <div className="flex-1 p-4 grid grid-cols-3 gap-3 content-start">
           {FIXED_ROOM_NUMBERS.map(roomNum => {
               const roomConfig = managedRooms.find(r => r.number === roomNum);
               const isAssigned = !!roomConfig;
               const roomType = roomConfig ? roomTypes.find(t => t.id === roomConfig.typeId) : null;

               return (
                   <button 
                       key={roomNum} 
                       onClick={() => isAssigned && startInspection(roomNum)} 
                       disabled={!isAssigned}
                       className={`p-4 rounded-xl border shadow-sm transition-all flex flex-col items-center justify-center aspect-square ${isAssigned ? 'bg-white border-gray-200 hover:border-green-500 hover:text-green-600 active:scale-95' : 'bg-gray-100 border-gray-100 text-gray-300 opacity-60 cursor-not-allowed'}`}
                   >
                       <span className="text-xl font-bold">{roomNum}</span>
                       <span className="text-[10px] mt-1 text-center line-clamp-1">{isAssigned ? roomType?.name : '未分配'}</span>
                   </button>
               );
           })}
       </div>
       <BottomNav />
    </div>
  );

  const InspectionView = () => {
      const items = getItemsForInspection(currentInspection.roomTypeId);
      const totalItems = items.length;
      const completedCount = items.filter(item => currentInspection.steps[item.id]?.photo).length;
      const progressPercent = totalItems > 0 ? (completedCount / totalItems) * 100 : 0;
      const isReadyToSubmit = completedCount === totalItems;
      
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="bg-white px-4 py-4 border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setView('ROOM_ENTRY')} className="p-1 hover:bg-gray-100 rounded-full"><ChevronLeft className="text-gray-800 w-6 h-6" /></button>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">{currentInspection.roomNumber} 房间巡检</h2>
                            <p className="text-[10px] text-gray-500">{hotelName} • {roomTypes.find(t => t.id === currentInspection.roomTypeId)?.name}</p>
                        </div>
                    </div>
                    <div className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                        进度: {completedCount}/{totalItems}
                    </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                        className="bg-green-600 h-full transition-all duration-500 ease-out"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto pb-24">
                {items.map(item => (
                    <ChecklistCard 
                        key={item.id}
                        item={item}
                        data={currentInspection.steps[item.id] || { photo: null, timestamp: null, issues: [] }}
                        onUpdatePhoto={(photo, timestamp) => handlePhotoCapture(item.id, photo, timestamp)}
                        onReportIssue={(type) => openIssueModal(item.id, type)}
                    />
                ))}
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                <button 
                    onClick={submitInspection}
                    disabled={!isReadyToSubmit}
                    className="w-full bg-green-600 text-white font-bold py-4 rounded-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-200 active:scale-95 transition-all"
                >
                    {isReadyToSubmit ? '提交巡检报告' : `请完成所有拍照项 (${completedCount}/{totalItems})`}
                </button>
            </div>

            <IssueModal 
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmitIssue}
                type={activeIssueType}
                itemName={items.find(i => i.id === activeItemId)?.title || ''}
                initialDescription={editingIssueData?.description}
                initialAttachment={editingIssueData?.attachment}
                initialIsVideo={editingIssueData?.isVideo}
            />
        </div>
      );
  };

  const HistoryDetailView = () => {
    if (!selectedHistoryItem) return <div>Loading...</div>;
    
    const typeDef = roomTypes.find(t => t.id === selectedHistoryItem.roomTypeId);
    const items = typeDef ? typeDef.items : [];

    const handleAudit = (status: 'APPROVED' | 'REJECTED') => {
        setHistory(prev => prev.map(h => h.id === selectedHistoryItem.id ? { ...h, status } : h));
        setSelectedHistoryItem(prev => prev ? ({ ...prev, status }) : null); 
        setView(previousView); 
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white px-4 py-4 border-b border-gray-200 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
                <button onClick={() => setView(previousView)} className="p-1 hover:bg-gray-100 rounded-full">
                    <ChevronLeft className="text-gray-800 w-6 h-6" />
                </button>
                <h2 className="text-lg font-bold text-gray-800">巡检详情</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
                {/* Summary */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                     <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">{selectedHistoryItem.roomNumber}</h3>
                            <p className="text-gray-500 text-sm">{selectedHistoryItem.hotelName} • {typeDef?.name}</p>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-bold ${
                            selectedHistoryItem.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                            selectedHistoryItem.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                            'bg-amber-100 text-amber-700'
                        }`}>
                            {selectedHistoryItem.status === 'APPROVED' ? '已通过' :
                             selectedHistoryItem.status === 'REJECTED' ? '已驳回' : '待审核'}
                        </div>
                     </div>
                     <div className="text-xs text-gray-400 flex flex-col gap-1 mt-2">
                        <span className="flex items-center gap-2"><Clock size={12} /> 提交时间: {selectedHistoryItem.completedAt}</span>
                        <span className="flex items-center gap-2"><User size={12} /> 巡检人员: {authorizedUsers.find(u => u.id === selectedHistoryItem.userId)?.name || selectedHistoryItem.userId}</span>
                     </div>
                </div>

                {/* Checklist Items */}
                <h3 className="font-bold text-gray-700 ml-1">巡检项目明细</h3>
                {items.map(item => {
                    const stepData = selectedHistoryItem.steps[item.id];
                    if (!stepData) return null; 

                    return (
                        <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                             <div className="flex justify-between mb-2">
                                <h4 className="font-bold text-gray-800">{item.title}</h4>
                                {stepData.issues.length > 0 ? (
                                    <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded flex items-center gap-1"><AlertTriangle size={10}/> 有问题</span>
                                ) : (
                                    <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded flex items-center gap-1"><CheckCircle2 size={10}/> 正常</span>
                                )}
                             </div>
                             
                             {/* Photo */}
                             {stepData.photo && (
                                <div className="mb-3 rounded-lg overflow-hidden border border-gray-100 relative">
                                    <img src={stepData.photo} alt={item.title} className="w-full h-48 object-cover" onClick={() => window.open(stepData.photo!)} />
                                    <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                                        {stepData.timestamp}
                                    </div>
                                </div>
                             )}

                             {/* Issues */}
                             {stepData.issues.length > 0 && (
                                 <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                                     {stepData.issues.map(issue => (
                                         <div key={issue.id} className="flex gap-2 items-start border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                                             <div className="mt-0.5 text-red-500"><AlertTriangle size={14} /></div>
                                             <div className="flex-1">
                                                 <div className="flex justify-between items-center">
                                                    <span className="text-xs font-bold text-gray-700">{issue.type === 'FAULT' ? '设备故障' : issue.type === 'RESTOCK' ? '缺物料' : '其他'}</span>
                                                    <span className={`text-[10px] px-1.5 rounded ${issue.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                        {issue.status === 'RESOLVED' ? '已解决' : '待处理'}
                                                    </span>
                                                 </div>
                                                 <p className="text-xs text-gray-600 mt-0.5">{issue.description}</p>
                                                 {issue.attachment && (
                                                     <div className="mt-1">
                                                        <span className="text-[10px] text-blue-500 underline cursor-pointer" onClick={() => window.open(issue.attachment)}>查看附件</span>
                                                     </div>
                                                 )}
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             )}
                        </div>
                    );
                })}
            </div>

            {/* Audit Actions Footer */}
            {userRole === 'ADMIN' && selectedHistoryItem.status === 'PENDING' && (
                <div className="bg-white border-t border-gray-200 p-4 sticky bottom-0 z-20 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] flex gap-3">
                    <button onClick={() => handleAudit('REJECTED')} className="flex-1 bg-red-50 text-red-600 font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all">
                        <ThumbsDown size={18} /> 驳回
                    </button>
                    <button onClick={() => handleAudit('APPROVED')} className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
                        <ThumbsUp size={18} /> 通过
                    </button>
                </div>
            )}
        </div>
    );
  };

  return (
    <>
      {view === 'LOGIN' && <LoginView />}
      {view === 'HOTEL_SELECT' && <HotelSelectView />}
      {view === 'HOME' && <HomeView />}
      {view === 'HISTORY' && <HistoryListView />}
      {view === 'ME' && <MeView />}
      {view === 'ADMIN_ME' && <AdminMeView />}
      {view === 'MAINTENANCE' && <MaintenanceView />}
      {view === 'MARKETING_AUDIT' && <MarketingAuditView />}
      {view === 'MARKETING_HISTORY' && <MarketingHistoryView />}
      {view === 'MARKETING_DETAIL' && <MarketingDetailView />}
      {view === 'ROOM_ENTRY' && <RoomEntryView />}
      {view === 'INSPECTION' && <InspectionView />}
      {view === 'SUCCESS' && <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
        <div className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center mb-8 shadow-inner"><CheckCircle2 className="w-16 h-16 text-green-600" /></div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">业务已提交！</h2>
        <button onClick={() => setView('HOME')} className="w-full max-w-xs bg-green-600 text-white font-bold py-4 rounded-xl text-lg shadow-lg active:scale-95 transition-all">返回首页</button>
      </div>}
      {/* Config Views */}
      {view === 'CONFIG' && <RoomConfigView />}
      {view === 'MARKETING_CONFIG' && <GenericTaskConfigView title="全员营销配置" tasks={marketingTasks} setTasks={setMarketingTasks} type="MARKETING" />}
      {view === 'COUPON_CONFIG' && <GenericTaskConfigView title="升级券配置" tasks={couponTasks} setTasks={setCouponTasks} type="COUPON" />}
      {view === 'REVIEW_CONFIG' && <GenericTaskConfigView title="好评引导配置" tasks={reviewTasks} setTasks={setReviewTasks} type="REVIEW" />}
      
      {view === 'STAFF_MARKETING' && <GenericStaffTaskView title="全员营销任务" tasks={marketingTasks.filter(t => t.status === 'ACTIVE')} onBack={() => setView('HOME')} category="MKT" />}
      {view === 'STAFF_COUPON' && <GenericStaffTaskView title="升级券任务" tasks={couponTasks.filter(t => t.status === 'ACTIVE')} onBack={() => setView('HOME')} category="CPN" />}
      {view === 'STAFF_REVIEW' && <GenericStaffTaskView title="好评引导任务" tasks={reviewTasks.filter(t => t.status === 'ACTIVE')} onBack={() => setView('HOME')} category="RVW" />}
      
      {view === 'HISTORY_DETAIL' && <HistoryDetailView />}
    </>
  );
}
