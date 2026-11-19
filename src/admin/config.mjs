const text = (name, label, extra = {}) => ({ name, label, widget: 'string', ...extra });
const imageAccept = 'image/png,image/jpeg,image/webp,image/gif,image/avif';
const urlPattern = ['^(https?://|mailto:).+', 'Use a full https://, http://, or mailto: link.'];
export function editorConfig({ localTest = false } = {}) {
  return {
    load_config_file: false,
    app_title: localTest ? 'Editor · local test' : 'Suhaan · Site editor',
    backend: localTest ? { name: 'test-repo' } : { name: 'github', repo: 'SuhaanCoding/suhaancoding.github.io', branch: 'main', auth_methods: ['token'] },
    site_url: 'https://suhaancoding.github.io',
    display_url: 'https://suhaancoding.github.io',
    logo: { src: '/images/shark.png', show_in_header: false },
    media_folder: 'public/images',
    public_folder: '/images',
    media_library: {name:'default',config:{max_file_size:10485760,slugify_filename:true}},
    slug: { encoding: 'ascii', clean_accents: true, sanitize_replacement: '-' },
    collections: [
      {
        name: 'notes', label: 'Notes', label_singular: 'Note', folder: 'content/posts', create: true,
        extension: 'md', format: 'yaml-frontmatter', slug: '{{slug}}', preview_path: 'writing/{{slug}}/',
        summary: '{{title}}', sortable_fields: ['title','date','section','order'],
        view_groups: [{label:'Section',field:'section'},{label:'Drafts',field:'draft'},{label:'Pinned',field:'pinned'}],
        fields: [
          text('title','Title'),
          {name:'body',label:'Note',widget:'markdown',required:false,sanitize_preview:true,
            buttons:['bold','italic','strikethrough','code','link','heading-two','heading-three','bulleted-list','numbered-list','task-list','quote'],
            editor_components:['image','code-block','table','hr','equation','inline-equation'],
            hint:'Insert → Equation for math. Preview updates as you type.'},
          {name:'date',label:'Date',widget:'datetime',default:new Date().toISOString().slice(0,10),format:'YYYY-MM-DD',date_format:'MMM D, YYYY',time_format:false,picker_utc:true},
          {name:'summary',label:'Summary',widget:'text',required:false,hint:'Optional. Used when sharing a link.'},
          {name:'draft',label:'Draft',widget:'boolean',default:true,hint:'Drafts are hidden from the website. The repository itself is public.'},
          text('section','Section',{required:false,hint:'Optional. Notes with the same section are grouped together.'}),
          {name:'tags',label:'Tags',widget:'list',required:false,allow_add:true,field:text('tag','Tag')},
          {name:'pinned',label:'Pin this note',widget:'boolean',default:false,required:false},
          {name:'order',label:'Order',widget:'number',value_type:'int',min:0,default:0,required:false,hint:'Lower numbers first. Notes with the same order are sorted newest first.'},
        ],
      },
      {
        name:'website',label:'Website',files:[{
          name:'site',label:'Profile, links & experience',file:'site.config.json',format:'json',
          fields:[
            text('name','Name'), text('profile','Profile line',{required:false}),
            {name:'profileImage',label:'Profile image',widget:'image',accept:imageAccept,required:false},
            text('profileImageAlt','Image description',{required:false}),
            text('description','Search description',{required:false}),
            {name:'labels',label:'Section labels',widget:'object',collapsed:true,fields:[text('notes','Notes heading'),text('experience','Experience heading'),text('empty','Empty notes message')]},
            {name:'links',label:'Profile links',widget:'list',collapsed:true,required:false,summary:'{{fields.label}}',fields:[text('label','Label'),text('url','Link',{pattern:urlPattern})]},
            {name:'experience',label:'Experience',widget:'list',collapsed:true,required:false,summary:'{{fields.organization}} · {{fields.role}}',fields:[text('organization','Organization'),text('role','Role'),text('period','Dates',{required:false,hint:'For example: Oct 2026 — Present'}),{name:'description',label:'Description',widget:'text',required:false}]},
            text('url','Website address',{pattern:['^https://.+','Use a full https:// address.'],hint:'Used for sharing and search links. Does not change the hosting address.'}),
          ],
        }],
      },
    ],
  };
}
