import React from 'react';
import { AlertTriangle, PackagePlus, HelpCircle, CheckCircle, ImageIcon, Check, Camera } from 'lucide-react';
import { CheckItemDefinition, InspectionStepData, IssueType } from '../types';
import { CameraInput } from './CameraInput';

interface ChecklistCardProps {
  item: CheckItemDefinition;
  data: InspectionStepData;
  onUpdatePhoto: (photo: string, timestamp: string) => void;
  onReportIssue: (type: IssueType) => void;
  readOnly?: boolean;
}

export const ChecklistCard: React.FC<ChecklistCardProps> = ({ item, data, onUpdatePhoto, onReportIssue, readOnly = false }) => {
  const isComplete = !!data.photo;

  const hasIssueOfType = (type: IssueType) => {
    return data.issues.some(i => i.type === type);
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm mb-5 border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-2">
            <h3 className="font-black text-gray-800 text-xl">{item.title}</h3>
          </div>
          <p className="text-gray-400 text-sm mt-2 font-medium leading-relaxed">{item.description}</p>
        </div>
        {isComplete && (
          <CheckCircle className="text-green-500 w-6 h-6 flex-shrink-0" />
        )}
      </div>

      {/* Reference & Camera/Image Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <p className="text-[11px] text-gray-300 font-bold tracking-wider uppercase">拍照示意图</p>
          <img 
            src={item.referenceImage} 
            alt="Reference" 
            className="w-full h-40 object-cover rounded-xl border border-gray-100 shadow-inner"
          />
        </div>
        <div className="space-y-2">
          <p className="text-[11px] text-gray-300 font-bold tracking-wider uppercase">{readOnly ? '现场照片' : '现场拍照'}</p>
          {readOnly ? (
            data.photo ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-100">
                <img src={data.photo} alt="Recorded" className="w-full h-40 object-cover" />
                <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                  {data.timestamp}
                </div>
              </div>
            ) : (
              <div className="w-full h-40 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300">
                <ImageIcon size={24} />
                <span className="text-[10px] mt-1 font-bold">未拍照</span>
              </div>
            )
          ) : (
            <CameraInput 
              onCapture={onUpdatePhoto} 
              existingImage={data.photo}
              label="点击拍照"
            />
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {!readOnly && isComplete && (
        <div className="grid grid-cols-3 gap-2 border-t pt-4 border-gray-50">
          <button 
            onClick={() => onReportIssue('FAULT')}
            className={`flex flex-col items-center justify-center py-3 rounded-xl transition-all gap-1 border-2 ${
                hasIssueOfType('FAULT') 
                ? 'bg-red-50 border-red-100 text-red-600 shadow-sm' 
                : 'bg-white border-transparent hover:bg-gray-50 text-gray-400'
            }`}
          >
            <div className="relative">
                <AlertTriangle size={20} />
                {hasIssueOfType('FAULT') && (
                    <div className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5">
                        <Check size={8} strokeWidth={4} />
                    </div>
                )}
            </div>
            <span className="text-[10px] font-black">{hasIssueOfType('FAULT') ? '已录入' : '设备故障'}</span>
          </button>
          
          <button 
            onClick={() => onReportIssue('RESTOCK')}
            className={`flex flex-col items-center justify-center py-3 rounded-xl transition-all gap-1 border-2 ${
                hasIssueOfType('RESTOCK') 
                ? 'bg-blue-50 border-blue-100 text-blue-600 shadow-sm' 
                : 'bg-white border-transparent hover:bg-gray-50 text-gray-400'
            }`}
          >
            <div className="relative">
                <PackagePlus size={20} />
                {hasIssueOfType('RESTOCK') && (
                    <div className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full p-0.5">
                        <Check size={8} strokeWidth={4} />
                    </div>
                )}
            </div>
            <span className="text-[10px] font-black">{hasIssueOfType('RESTOCK') ? '已录入' : '物料补充'}</span>
          </button>
          
          <button 
            onClick={() => onReportIssue('OTHER')}
            className={`flex flex-col items-center justify-center py-3 rounded-xl transition-all gap-1 border-2 ${
                hasIssueOfType('OTHER') 
                ? 'bg-amber-50 border-amber-100 text-amber-600 shadow-sm' 
                : 'bg-white border-transparent hover:bg-gray-50 text-gray-400'
            }`}
          >
            <div className="relative">
                <HelpCircle size={20} />
                {hasIssueOfType('OTHER') && (
                    <div className="absolute -top-1 -right-1 bg-amber-600 text-white rounded-full p-0.5">
                        <Check size={8} strokeWidth={4} />
                    </div>
                )}
            </div>
            <span className="text-[10px] font-black">{hasIssueOfType('OTHER') ? '已录入' : '其他问题'}</span>
          </button>
        </div>
      )}
    </div>
  );
};