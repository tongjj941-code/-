
import React, { useState, useRef, useEffect } from 'react';
import { X, Mic, Sparkles, Image as ImageIcon, Video } from 'lucide-react';
import { IssueType } from '../types';
import { analyzeFaultImage } from '../services/geminiService';

interface IssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (description: string, attachment: string | undefined, isVideo: boolean) => void;
  type: IssueType;
  itemName: string;
  initialDescription?: string;
  initialAttachment?: string;
  initialIsVideo?: boolean;
}

export const IssueModal: React.FC<IssueModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  type, 
  itemName,
  initialDescription = '',
  initialAttachment = undefined,
  initialIsVideo = false
}) => {
  const [description, setDescription] = useState(initialDescription);
  const [attachment, setAttachment] = useState<string | undefined>(initialAttachment);
  const [isVideo, setIsVideo] = useState(initialIsVideo);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when modal opens with initial values
  useEffect(() => {
    if (isOpen) {
      setDescription(initialDescription);
      setAttachment(initialAttachment);
      setIsVideo(initialIsVideo);
    }
  }, [isOpen, initialDescription, initialAttachment, initialIsVideo]);

  if (!isOpen) return null;

  const getTitle = () => {
    const prefix = initialDescription || initialAttachment ? '编辑' : '添加';
    switch (type) {
      case 'FAULT': return `${prefix}设备故障申报`;
      case 'RESTOCK': return `${prefix}物料补充申请`;
      case 'OTHER': return `${prefix}其他问题反馈`;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const isVid = file.type.startsWith('video/');
      setIsVideo(isVid);

      const reader = new FileReader();
      reader.onload = (ev) => {
        setAttachment(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAIDiagnose = async () => {
    if (!attachment || isVideo) return;
    setIsAnalyzing(true);
    const result = await analyzeFaultImage(attachment);
    setDescription(prev => prev ? `${prev} \n[AI 诊断]: ${result}` : result);
    setIsAnalyzing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-0">
      <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
          <div>
            <h3 className="font-bold text-gray-800">{getTitle()}</h3>
            <p className="text-xs text-gray-500">关联项目: {itemName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          
          {/* Description Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">问题描述</label>
            <div className="relative">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={type === 'RESTOCK' ? "例如：缺少2条毛巾..." : "请详细描述问题..."}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none min-h-[100px] text-sm resize-none"
              />
              {/* AI Button - Only for Faults with Image */}
              {type === 'FAULT' && attachment && !isVideo && (
                <button
                  onClick={handleAIDiagnose}
                  disabled={isAnalyzing}
                  className="absolute bottom-2 right-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-md flex items-center gap-1 hover:bg-purple-200 transition-colors disabled:opacity-50"
                >
                  <Sparkles size={12} />
                  {isAnalyzing ? '分析中...' : 'AI 诊断'}
                </button>
              )}
            </div>
          </div>

          {/* Media Upload - Enabled for FAULT and RESTOCK */}
          {(type === 'FAULT' || type === 'RESTOCK') && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">上传凭证 (照片/视频)</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-green-400 transition-colors cursor-pointer min-h-[100px]"
              >
                {attachment ? (
                  isVideo ? (
                     <div className="flex flex-col items-center text-green-600">
                        <Video size={32} />
                        <span className="text-xs mt-2">已选择视频</span>
                     </div>
                  ) : (
                    <img src={attachment} alt="Preview" className="h-24 object-contain" />
                  )
                ) : (
                  <>
                    <div className="flex gap-2 mb-1">
                      <ImageIcon size={20} />
                      <Video size={20} />
                    </div>
                    <span className="text-xs">点击上传</span>
                  </>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*,video/*" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 grid grid-cols-2 gap-3">
          <button 
            onClick={onClose}
            className="w-full py-3 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            取消
          </button>
          <button 
            onClick={() => {
                onSubmit(description, attachment, isVideo);
                onClose();
            }}
            disabled={!description.trim() && !attachment}
            className="w-full py-3 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 active:scale-95 transition-all shadow-lg shadow-green-200 disabled:opacity-50 disabled:active:scale-100"
          >
            保存并提交
          </button>
        </div>
      </div>
    </div>
  );
};
