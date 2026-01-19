import { Plus, Edit, Trash2, FileText, Shield } from "lucide-react";

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

export {
  getActionIcon,
  getActionColor,
  getActionLabel,
  getEntityLabel,
  formatDate,
};
