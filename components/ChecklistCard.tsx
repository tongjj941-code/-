
import React from 'react';
import { AlertTriangle, PackagePlus, HelpCircle, CheckCircle, ImageIcon, Check } from 'lucide-react';
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
    <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-800 text-lg">{item.title}</h3>
          </div>
          <p className="text-gray-500 text-sm mt-1">{item.description}</p>
        </div>
        {isComplete && (
          <CheckCircle className="text-green-500 w-6 h-6 flex-shrink-0" />
        )}
      </div>

      {/* Reference & Camera/Image */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="space-y-1">
          <p className="text-xs text-gray-400 font-medium ml-1">拍照示意图</p>
          <img 
            src={item.referenceImage} 
            alt="Reference" 
            className="w-full h-48 object-cover rounded-lg border border-gray-100"
          />
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-400 font-medium ml-1">{readOnly ? '现场照片' : '现场拍照'}</p>
          {readOnly ? (
            data.photo ? (
              <div className="relative rounded-lg overflow-hidden border border-gray-200">
                <img src={data.photo} alt="Recorded" className="w-full h-48 object-cover" />
                <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                  {data.timestamp}
                </div>
              </div>
            ) : (
              <div className="w-full h-48 bg-gray-50 rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
                <ImageIcon size={24} />
                <span className="text-xs mt-1">未拍照</span>
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

      {/* Action Buttons - Only show if not readOnly and photo is taken */}
      {!readOnly && isComplete && (
        <div className="grid grid-cols-3 gap-2 border-t pt-3 border-gray-100">
          <button 
            onClick={() => onReportIssue('FAULT')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all gap-1 border-2 ${
                hasIssueOfType('FAULT') 
                ? 'bg-red-50 border-red-200 text-red-600 shadow-sm' 
                : 'bg-white border-transparent hover:bg-gray-50 text-gray-600'
            }`}
          >
            <div className="relative">
                <AlertTriangle size={20} className={hasIssueOfType('FAULT') ? 'text-red-600' : 'text-gray-400'} />
                {hasIssueOfType('FAULT') && (
                    <div className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5">
                        <Check size={8} strokeWidth={4} />
                    </div>
                )}
            </div>
            <span className={`text-xs font-bold ${hasIssueOfType('FAULT') ? 'text-red-700' : 'text-gray-600'}`}>
                {hasIssueOfType('FAULT') ? '已录入' : '设备故障'}
            </span>
          </button>
          
          <button 
            onClick={() => onReportIssue('RESTOCK')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all gap-1 border-2 ${
                hasIssueOfType('RESTOCK') 
                ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm' 
                : 'bg-white border-transparent hover:bg-gray-50 text-gray-600'
            }`}
          >
            <div className="relative">
                <PackagePlus size={20} className={hasIssueOfType('RESTOCK') ? 'text-blue-600' : 'text-gray-400'} />
                {hasIssueOfType('RESTOCK') && (
                    <div className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full p-0.5">
                        <Check size={8} strokeWidth={4} />
                    </div>
                )}
            </div>
            <span className={`text-xs font-bold ${hasIssueOfType('RESTOCK') ? 'text-blue-700' : 'text-gray-600'}`}>
                {hasIssueOfType('RESTOCK') ? '已录入' : '物料补充'}
            </span>
          </button>
          
          <button 
            onClick={() => onReportIssue('OTHER')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all gap-1 border-2 ${
                hasIssueOfType('OTHER') 
                ? 'bg-amber-50 border-amber-200 text-amber-600 shadow-sm' 
                : 'bg-white border-transparent hover:bg-gray-50 text-gray-600'
            }`}
          >
            <div className="relative">
                <HelpCircle size={20} className={hasIssueOfType('OTHER') ? 'text-amber-600' : 'text-gray-400'} />
                {hasIssueOfType('OTHER') && (
                    <div className="absolute -top-1 -right-1 bg-amber-600 text-white rounded-full p-0.5">
                        <Check size={8} strokeWidth={4} />
                    </div>
                )}
            </div>
            <span className={`text-xs font-bold ${hasIssueOfType('OTHER') ? 'text-amber-700' : 'text-gray-600'}`}>
                {hasIssueOfType('OTHER') ? '已录入' : '其他问题'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
