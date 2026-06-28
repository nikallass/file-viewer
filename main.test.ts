import { describe, expect, it, vi } from 'vitest';

vi.mock('obsidian', () => ({
    App: class App {},
    Notice: class Notice {},
    Plugin: class Plugin {},
    PluginSettingTab: class PluginSettingTab {},
    Setting: class Setting {},
    TextFileView: class TextFileView {}
}));

import { SUPPORT_ISSUES_URL } from './support';

describe('support link', () => {
    it('points users to the File Viewer GitHub issues page', () => {
        expect(SUPPORT_ISSUES_URL).toBe('https://github.com/jethrojones/file-viewer/issues');
    });
});
