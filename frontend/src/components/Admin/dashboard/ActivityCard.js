// export interface IHistoryInput {
//   user: mongoose.Types.ObjectId;
//   action: string;
//   entity: string;
//   entityId?: mongoose.Types.ObjectId;
//   entityModel?: string;
//   description?: string;
// }

// export interface IHistory extends IHistoryInput, mongoose.Document {
//   datetime: Date;
//   isArchive: boolean;
// }

import { motion } from "framer-motion";
import { User, Megaphone, FileText, Calendar, History } from "lucide-react";
import {
  formatDate,
  getActionColor,
  getActionIcon,
  getActionLabel,
  getEntityLabel,
} from "../history/utils";
export const ActivityCard = ({ history }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 gap-y-2 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-x-4 ">
        <div className={`${getActionColor(history.action)} p-2 rounded-lg`}>
          {getActionIcon(history.action)}
        </div>
        <div className="flex flex-col gap-y-1 w-full">
          <h2>{history.description}</h2>
          <div className="flex items-center justify-between  ">
            <div className="flex items-center gap-x-2">
              <User className="h-5 w-5 bg-gray-200 text-gray-800 rounded-full p-1" />
              <p className="text-sm text-gray-500 dark:text-gray-300">
                {history.user?.username}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-300">
                {formatDate(history.datetime)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
