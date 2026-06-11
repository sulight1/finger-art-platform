import request from './request';

export interface SkillItem {
  id: number;
  userId: number;
  username: string;
  avatar: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  zaowuBiCost: number;
  rating: number;
  credit: number;
  exchangeCount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export const getSkills = (category?: string, status?: string) => {
  return request.get('/skills', { 
    params: { 
      category: category || undefined, 
      status: status || undefined 
    } 
  }) as Promise<SkillItem[]>;
};

export const auditSkill = (id: number, status: string) => {
  return request.patch(`/skills/${id}/audit`, null, { params: { status } });
};

export const addSkill = (data: Partial<SkillItem>) => {
  return request.post('/skills', data) as Promise<SkillItem>;
};

export const deleteSkill = (id: number) => {
  return request.delete(`/skills/${id}`) as Promise<string>;
};

export const requestExchange = (data: { 
  userAId: number;
  userBId: number; 
  description: string; 
  startTime: string; 
  endTime: string; 
  zaowuBiCost?: number;
  scheduleDate?: string;
}) => {
  return request.post('/skill-exchange/request', data);
};

export const getMyExchanges = (userId: number) => {
  return request.get('/skill-exchange/my', { params: { userId } }) as Promise<any[]>;
};

export const completeExchange = (id: number) => {
  return request.patch(`/skill-exchange/${id}/complete`);
};

// ========== 排期日历 ==========
export interface ScheduleSlot {
  id?: number;
  userId: number;
  date: string;       // YYYY-MM-DD
  status: string;     // FREE / BUSY / PENDING
  remark?: string;
}

export const getScheduleSlots = (userId: number, year: number, month: number) => {
  return request.get('/schedule-slots', { params: { userId, year, month } }) as Promise<ScheduleSlot[]>;
};

export const saveScheduleSlot = (userId: number, date: string, status: string, remark?: string) => {
  return request.post('/schedule-slots', null, { params: { userId, date, status, remark } }) as Promise<ScheduleSlot>;
};
