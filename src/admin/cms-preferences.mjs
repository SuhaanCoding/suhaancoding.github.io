// Sveltia 0.269.2 exports this same reactive preference store for its own settings.
// Use it directly so the top-bar switch, Settings > Appearance, and saved theme
// all have one owner. This pinned internal adapter must be checked on CMS upgrades.
import { Wt as preferences } from '../../node_modules/@sveltia/cms/npm/chunks/init-BCqln4LQ.js';
export const getEditorTheme = () => preferences.theme;
export const setEditorTheme = theme => { preferences.theme = theme; };
