import React, { useEffect, useState } from "react";
import {
  Clock,
  User,
  FileText,
  Trash2,
  Edit,
  Plus,
  Search,
  Filter,
  ChevronDown,
  Calendar,
  Eye,
  Shield,
  RefreshCw,
} from "lucide-react";
import { useToast } from "../../context/toastProvider";
import { getAllHistory } from "../../services/historyAPI";

const History = () => {
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterAction, setFilterAction] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAllHistory();
      if (response.statusCode !== 200) {
        toast.error(response.message);
        setLoading(false);
        return;
      }
      console.log("RESPONSE HISTORY: ", response);
      setHistory(response.data.history);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch history");
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    switch (action.toUpperCase()) {
      case "POST":
        return <Plus className="w-4 h-4" />;
      case "UPDATE":
      case "PATCH":
        return <Edit className="w-4 h-4" />;
      case "DELETE":
        return <Trash2 className="w-4 h-4" />;
      case "AUTH":
        return <Shield className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getActionColor = (action) => {
    switch (action.toUpperCase()) {
      case "POST":
        return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400";
      case "UPDATE":
      case "PATCH":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
      case "DELETE":
        return "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";
      case "AUTH":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400";
    }
  };

  const getActionLabel = (action) => {
    const labels = {
      POST: "Create",
      UPDATE: "Update",
      PATCH: "Modify",
      DELETE: "Delete",
      AUTH: "Authentication",
    };
    return labels[action.toUpperCase()] || action;
  };

  const getEntityLabel = (entity) => {
    const labels = {
      lecturer: "Dosen",
      announcement: "Pengumuman",
      user: "User",
      auth: "Authentication",
      settings: "Settings",
      highlight: "Highlight",
    };
    return labels[entity] || entity;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) {
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (days > 0) {
      return `${days} hari yang lalu`;
    } else if (hours > 0) {
      return `${hours} jam yang lalu`;
    } else if (minutes > 0) {
      return `${minutes} menit yang lalu`;
    } else {
      return "Baru saja";
    }
  };

  const filterByDateRange = (item) => {
    if (dateRange === "all") return true;

    const itemDate = new Date(item.datetime || item.createdAt);
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    switch (dateRange) {
      case "today":
        return itemDate >= startOfDay;
      case "week":
        return itemDate >= startOfWeek;
      case "month":
        return itemDate >= startOfMonth;
      default:
        return true;
    }
  };

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.entity?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.userData?.username
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesType = filterType === "all" || item.entity === filterType;
    const matchesAction =
      filterAction === "all" ||
      item.action.toUpperCase() === filterAction.toUpperCase();
    const matchesDate = filterByDateRange(item);

    return matchesSearch && matchesType && matchesAction && matchesDate;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Activity History
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Track all changes and activities in the system
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 
                dark:border-gray-700 text-gray-700 dark:text-gray-300 
                hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50">
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              <span className="text-sm">Refresh</span>
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total: {filteredHistory.length} activities
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 
                dark:border-gray-700 bg-gray-50 dark:bg-gray-900 
                text-gray-800 dark:text-white placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                transition-all"
            />
          </div>

          {/* Filter Entity Type */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 
                dark:border-gray-700 bg-gray-50 dark:bg-gray-900 
                text-gray-800 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                appearance-none cursor-pointer transition-all">
              <option value="all">All Types</option>
              <option value="announcement">Pengumuman</option>
              <option value="lecturer">Dosen</option>
              <option value="highlight">Highlight</option>
              <option value="user">User</option>
              <option value="auth">Authentication</option>
              <option value="settings">Settings</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          {/* Filter Action */}
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 
                dark:border-gray-700 bg-gray-50 dark:bg-gray-900 
                text-gray-800 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                appearance-none cursor-pointer transition-all">
              <option value="all">All Actions</option>
              <option value="POST">Create</option>
              <option value="UPDATE">Update</option>
              <option value="PATCH">Modify</option>
              <option value="DELETE">Delete</option>
              <option value="AUTH">Authentication</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Date Range - Second Row */}
        <div className="mt-4">
          <div className="relative max-w-xs">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 
                dark:border-gray-700 bg-gray-50 dark:bg-gray-900 
                text-gray-800 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                appearance-none cursor-pointer transition-all">
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Loading history...
            </p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              No activities found
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
              There are no activities matching your search criteria. Try
              adjusting your filters.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredHistory.map((item) => (
              <div
                key={item.id || item._id}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                <div className="flex gap-4">
                  {/* Action Icon */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${getActionColor(
                      item.action
                    )}`}>
                    {getActionIcon(item.action)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getActionColor(
                              item.action
                            )}`}>
                            {getActionLabel(item.action)}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300">
                            {getEntityLabel(item.entity)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {item.description || "No description available"}
                        </p>
                      </div>

                      {/* View Details Button */}
                      {item.entityId && (
                        <button
                          className="flex-shrink-0 p-2 rounded-lg text-gray-400 
                            hover:text-blue-600 dark:hover:text-blue-400 
                            hover:bg-blue-50 dark:hover:bg-blue-900/30 
                            transition-colors opacity-0 group-hover:opacity-100">
                          <Eye className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{item.userData?.username || "Unknown User"}</span>
                      </div>

                      {item.userData?.role && (
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-xs font-medium text-blue-700 dark:text-blue-300">
                            {item.userData.role}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          {formatDate(item.datetime || item.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredHistory.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing{" "}
              <span className="font-semibold">1-{filteredHistory.length}</span>{" "}
              of <span className="font-semibold">{history.length}</span> results
            </p>

            <div className="flex gap-2">
              <button
                disabled
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                  text-gray-400 dark:text-gray-600 cursor-not-allowed">
                Previous
              </button>
              <button
                disabled
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                  text-gray-400 dark:text-gray-600 cursor-not-allowed">
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
