import { defineStore } from 'pinia';

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        message: null,
        type: null, // 'success' | 'error' | 'info'
        visible: false
    }),
    actions: {
        showSuccess(msg) {
            this.message = msg;
            this.type = 'success';
            this.visible = true;
            this.autoHide();
        },
        showError(msg) {
            this.message = msg;
            this.type = 'error';
            this.visible = true;
            this.autoHide();
        },
        showInfo(msg) {
            this.message = msg;
            this.type = 'info';
            this.visible = true;
            this.autoHide();
        },
        hide() {
            this.visible = false;
            this.message = null;
            this.type = null;
        },
        autoHide() {
            setTimeout(() => {
                this.hide();
            }, 4000);
        }
    }
});
