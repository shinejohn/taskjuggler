import { reactive, readonly } from 'vue';

export interface ConfirmOptions {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    danger?: boolean;
}

interface ConfirmState {
    open: boolean;
    options: ConfirmOptions;
}

const state = reactive<ConfirmState>({
    open: false,
    options: { title: '', message: '' },
});

let resolver: ((value: boolean) => void) | null = null;

const confirm = (options: ConfirmOptions): Promise<boolean> => {
    state.options = options;
    state.open = true;
    return new Promise<boolean>((resolve) => {
        resolver = resolve;
    });
};

const settle = (value: boolean) => {
    state.open = false;
    if (resolver) {
        resolver(value);
        resolver = null;
    }
};

export function useConfirm() {
    return {
        state: readonly(state),
        confirm,
        accept: () => settle(true),
        cancel: () => settle(false),
    };
}
