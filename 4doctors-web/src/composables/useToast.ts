import { reactive, readonly } from 'vue';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
    id: number;
    type: ToastType;
    message: string;
}

const state = reactive<{ toasts: Toast[] }>({ toasts: [] });

let nextId = 1;

const dismiss = (id: number) => {
    const index = state.toasts.findIndex(t => t.id === id);
    if (index !== -1) state.toasts.splice(index, 1);
};

const push = (type: ToastType, message: string, duration = 4000) => {
    const id = nextId++;
    state.toasts.push({ id, type, message });
    if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
    }
    return id;
};

export function useToast() {
    return {
        toasts: readonly(state.toasts),
        success: (message: string, duration?: number) => push('success', message, duration),
        error: (message: string, duration?: number) => push('error', message, duration ?? 6000),
        info: (message: string, duration?: number) => push('info', message, duration),
        dismiss,
    };
}
