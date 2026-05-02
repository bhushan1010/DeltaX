import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Node, Edge } from '@xyflow/react';

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  nodes: Node[];
  edges: Edge[];
  createdAt: string;
  updatedAt: string;
}

interface AutomationState {
  rules: AutomationRule[];
  selectedRule: AutomationRule | null;
}

const initialState: AutomationState = {
  rules: [],
  selectedRule: null,
};

const automationSlice = createSlice({
  name: 'automation',
  initialState,
  reducers: {
    setRules: (state, action: PayloadAction<AutomationRule[]>) => {
      state.rules = action.payload;
    },
    addRule: (state, action: PayloadAction<AutomationRule>) => {
      state.rules.push(action.payload);
    },
    updateRule: (state, action: PayloadAction<AutomationRule>) => {
      const index = state.rules.findIndex(rule => rule.id === action.payload.id);
      if (index !== -1) {
        state.rules[index] = action.payload;
      }
      if (state.selectedRule?.id === action.payload.id) {
        state.selectedRule = action.payload;
      }
    },
    deleteRule: (state, action: PayloadAction<string>) => {
      state.rules = state.rules.filter(rule => rule.id !== action.payload);
      if (state.selectedRule?.id === action.payload) {
        state.selectedRule = null;
      }
    },
    setSelectedRule: (state, action: PayloadAction<AutomationRule | null>) => {
      state.selectedRule = action.payload;
    },
  },
});

export const { setRules, addRule, updateRule, deleteRule, setSelectedRule } = automationSlice.actions;
export default automationSlice.reducer;
