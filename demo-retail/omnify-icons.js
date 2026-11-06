/* Omnify icons — Lucide (https://lucide.dev/icons/)
 * Usage in templates: <om-icon name="shopping-cart" size="20"></om-icon>
 * `name` is the Lucide kebab-case name. In React production code this maps 1:1 to lucide-react:
 *   <om-icon name="shopping-cart" size="20">  →  import { ShoppingCart } from 'lucide-react'; <ShoppingCart size={20} />
 * `fill="1"` = active/selected state → strokeWidth 2.5 (Lucide is outline-only).
 * Color follows CSS `color` (stroke = currentColor).
 * LEGACY map: a few dynamic values still arrive as old Material Symbols names; they are translated here. */
(function () {
  if (customElements.get('om-icon')) return;
  const LUCIDE_SRC = 'https://unpkg.com/lucide@0.469.0/dist/umd/lucide.min.js';
  const LEGACY = {
    mail:'mail',lock:'lock',lock_open:'lock-open',error:'circle-alert',logout:'log-out',unfold_more:'chevrons-up-down',notifications:'bell',
    storefront:'store',point_of_sale:'calculator',expand_more:'chevron-down',expand_less:'chevron-up',check:'check',done:'check',
    manage_accounts:'user-cog',shield_person:'shield-user|shield-check',chevron_right:'chevron-right',chevron_left:'chevron-left',
    add_shopping_cart:'shopping-cart',remove_shopping_cart:'shopping-cart',search:'search',grid_view:'layout-grid',view_list:'list',info:'info',
    arrow_back:'arrow-left',arrow_forward:'arrow-right',receipt:'receipt',receipt_long:'receipt-text',delete_sweep:'trash-2',delete:'trash-2',
    table_restaurant:'utensils',restaurant:'utensils',person:'user',group:'users',pie_chart:'chart-pie|pie-chart',list:'list',remove:'minus',add:'plus',
    content_copy:'copy',rule:'list-checks',local_cafe:'coffee',coffee_maker:'coffee',edit:'pencil',sell:'tag',percent:'percent',
    event_available:'calendar-check',event_busy:'calendar-x',event:'calendar',event_repeat:'calendar-sync|calendar-clock',verified:'badge-check',
    qr_code_2:'qr-code',close:'x',clear:'x',cancel:'circle-x',print:'printer',skillet:'chef-hat',smartphone:'smartphone',wc:'toilet|bath',
    south:'arrow-down',south_west:'arrow-down-left',north_east:'arrow-up-right',touch_app:'pointer',schedule:'clock',undo:'undo-2',
    two_wheeler:'bike',moped:'bike',delivery_dining:'bike',timer:'timer',link:'link',link_off:'unlink',photo_camera:'camera',videocam_off:'video-off',
    verified_user:'shield-check',refresh:'refresh-cw',restart_alt:'rotate-ccw',add_photo_alternate:'image-plus',upload:'upload',download:'download',
    tune:'sliders-horizontal',arrow_upward:'arrow-up',arrow_downward:'arrow-down',settings:'settings',edit_note:'notebook-pen',
    select_all:'square-dashed|box-select',add_box:'square-plus|plus-square',local_shipping:'truck',inventory:'package',inventory_2:'archive',
    account_balance_wallet:'wallet',account_balance:'landmark',payments:'banknote',send:'send',attach_file:'paperclip',fact_check:'clipboard-check',
    person_add:'user-plus',how_to_reg:'user-check',location_on:'map-pin',location_off:'map-pin-off',my_location:'locate-fixed',
    check_circle:'circle-check',task_alt:'circle-check-big',done_all:'check-check',dialpad:'grid-3x3',key:'key-round',summarize:'file-text',
    chat:'message-circle',table_view:'sheet',picture_as_pdf:'file-down',pin:'rectangle-ellipsis',contactless:'nfc',hourglass_top:'hourglass',
    signal_cellular_alt:'signal',warning:'triangle-alert',visibility:'eye',visibility_off:'eye-off',help:'circle-help',backspace:'delete',
    badge:'id-card',block:'ban',category:'shapes',check_box:'square-check',check_box_outline_blank:'square',radio_button_checked:'circle-dot',
    radio_button_unchecked:'circle',cleaning_services:'brush-cleaning|sparkles',currency_exchange:'arrow-left-right',swap_horiz:'arrow-left-right',
    door_front:'door-closed',history:'history',hub:'network',local_fire_department:'flame',monitoring:'activity',room_service:'concierge-bell',
    sort_by_alpha:'arrow-down-a-z',space_dashboard:'layout-dashboard',takeout_dining:'shopping-bag'
  };
  const pascal = n => n.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
  const warned = {};
  function resolve(name) {
    const icons = window.lucide && window.lucide.icons; if (!icons || !name) return null;
    const cands = (LEGACY[name] || name).split('|');
    for (const c of cands) { const node = icons[pascal(c)]; if (node) return node; }
    if (!warned[name]) { warned[name] = 1; console.warn('[om-icon] unknown Lucide icon:', name); }
    return icons.CircleDashed || null;
  }
  const esc = v => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  class OmIcon extends HTMLElement {
    static get observedAttributes() { return ['name', 'size', 'fill', 'stroke']; }
    connectedCallback() { this.render(); }
    attributeChangedCallback() { if (this.isConnected) this.render(); }
    render() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      const name = (this.getAttribute('name') || '').trim();
      if (name.includes('{{')) return;
      const size = parseFloat(this.getAttribute('size')) || 24;
      const sw = this.getAttribute('stroke') || (String(this.getAttribute('fill')).trim() === '1' ? 2.5 : 2);
      const key = name + '|' + size + '|' + sw;
      if (key === this._k) return;
      let node = resolve(name);
      if (!node) { this._k = window.lucide ? key : null; root.innerHTML = name ? '<style>:host{width:' + size + 'px;height:' + size + 'px}</style>' : ''; return; }
      this._k = key;
      if (node[0] === 'svg') node = node[2];
      const kids = node.map(([t, a]) => '<' + t + Object.keys(a).map(k => ' ' + k + '="' + esc(a[k]) + '"').join('') + '></' + t + '>').join('');
      root.innerHTML = '<style>:host{display:inline-flex;align-items:center;justify-content:center;flex:none;line-height:0}</style><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + sw + '" stroke-linecap="round" stroke-linejoin="round" style="display:block">' + kids + '</svg>';
    }
  }
  customElements.define('om-icon', OmIcon);
  if (!window.lucide) {
    const s = document.createElement('script'); s.src = (window.__resources && window.__resources.lucideJs) || LUCIDE_SRC;
    s.onload = () => document.querySelectorAll('om-icon').forEach(el => { el._k = null; el.render(); });
    document.head.appendChild(s);
  }
})();
