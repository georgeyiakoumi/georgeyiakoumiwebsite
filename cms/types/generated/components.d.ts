import type { Schema, Struct } from '@strapi/strapi';

export interface AboutBusiness extends Struct.ComponentSchema {
  collectionName: 'components_about_businesses';
  info: {
    description: '';
    displayName: 'icon';
    icon: 'bulletList';
  };
  attributes: {
    classes: Schema.Attribute.Text;
    cssVariables: Schema.Attribute.JSON;
    cssVariablesDark: Schema.Attribute.JSON;
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images' | 'files'>;
    name: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface CvChapter extends Struct.ComponentSchema {
  collectionName: 'components_cv_chapters';
  info: {
    description: '';
    displayName: 'Chapter';
  };
  attributes: {
    end_date: Schema.Attribute.Date;
    experience: Schema.Attribute.Blocks & Schema.Attribute.Required;
    role: Schema.Attribute.String & Schema.Attribute.Required;
    start_date: Schema.Attribute.Date & Schema.Attribute.Required;
  };
}

export interface CvLanguages extends Struct.ComponentSchema {
  collectionName: 'components_cv_languages';
  info: {
    displayName: 'languages';
  };
  attributes: {
    level: Schema.Attribute.String;
    region: Schema.Attribute.String;
  };
}

export interface ProjectBlocksCarousel extends Struct.ComponentSchema {
  collectionName: 'components_project_blocks_carousels';
  info: {
    description: '';
    displayName: 'carousel';
  };
  attributes: {
    caption: Schema.Attribute.Text;
    noGap: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    slides: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    > &
      Schema.Attribute.Required;
  };
}

export interface ProjectBlocksCodeBlock extends Struct.ComponentSchema {
  collectionName: 'components_project_blocks_code_blocks';
  info: {
    description: '';
    displayName: 'code-block';
  };
  attributes: {
    caption: Schema.Attribute.Text;
    code: Schema.Attribute.Text & Schema.Attribute.Required;
    filename: Schema.Attribute.String;
    language: Schema.Attribute.Enumeration<
      [
        'typescript',
        'javascript',
        'css',
        'html',
        'json',
        'bash',
        'python',
        'go',
        'rust',
        'sql',
        'yaml',
        'markdown',
        'diff',
      ]
    > &
      Schema.Attribute.DefaultTo<'typescript'>;
  };
}

export interface ProjectBlocksComparisonSlider extends Struct.ComponentSchema {
  collectionName: 'components_project_blocks_comparison_sliders';
  info: {
    description: '';
    displayName: 'comparison-slider';
  };
  attributes: {
    after_image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    > &
      Schema.Attribute.Required;
    before_image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    > &
      Schema.Attribute.Required;
    caption: Schema.Attribute.Text;
    legacy: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface ProjectBlocksImage extends Struct.ComponentSchema {
  collectionName: 'components_project_blocks_images';
  info: {
    description: '';
    displayName: 'image';
  };
  attributes: {
    caption: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images' | 'files'> &
      Schema.Attribute.Required;
    zoomEnabled: Schema.Attribute.Boolean;
  };
}

export interface ProjectBlocksLottie extends Struct.ComponentSchema {
  collectionName: 'components_project_blocks_lotties';
  info: {
    description: '';
    displayName: 'lottie';
  };
  attributes: {
    autoplay: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    caption: Schema.Attribute.Text;
    file: Schema.Attribute.Media<'files'> & Schema.Attribute.Required;
    loop: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
  };
}

export interface ProjectBlocksRichText extends Struct.ComponentSchema {
  collectionName: 'components_project_blocks_rich_texts';
  info: {
    description: '';
    displayName: 'rich-text';
  };
  attributes: {
    content: Schema.Attribute.Blocks;
  };
}

export interface ProjectBlocksSnapshot extends Struct.ComponentSchema {
  collectionName: 'components_project_blocks_snapshots';
  info: {
    description: 'Key-value metadata block for case study snapshots (Role, Client, Date, etc.)';
    displayName: 'snapshot';
  };
  attributes: {
    items: Schema.Attribute.Component<'project-blocks.snapshot-item', true>;
  };
}

export interface ProjectBlocksSnapshotItem extends Struct.ComponentSchema {
  collectionName: 'components_project_blocks_snapshot_items';
  info: {
    description: 'A label-value pair for the snapshot block';
    displayName: 'snapshot-item';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProjectBlocksStatItem extends Struct.ComponentSchema {
  collectionName: 'components_project_blocks_stat_items';
  info: {
    description: '';
    displayName: 'stat-item';
  };
  attributes: {
    description: Schema.Attribute.String;
    group: Schema.Attribute.String;
    label: Schema.Attribute.String;
    suffix: Schema.Attribute.String;
    value: Schema.Attribute.Decimal;
  };
}

export interface ProjectBlocksStats extends Struct.ComponentSchema {
  collectionName: 'components_project_blocks_stats';
  info: {
    description: '';
    displayName: 'stats';
  };
  attributes: {
    area_variant: Schema.Attribute.Enumeration<
      ['default', 'linear', 'step', 'stacked', 'gradient']
    > &
      Schema.Attribute.DefaultTo<'default'>;
    bar_variant: Schema.Attribute.Enumeration<
      ['default', 'horizontal', 'multiple', 'stacked', 'negative']
    > &
      Schema.Attribute.DefaultTo<'default'>;
    chart_type: Schema.Attribute.Enumeration<
      ['area', 'bar', 'line', 'pie', 'radar', 'radial', 'number-only']
    >;
    description: Schema.Attribute.Text;
    items: Schema.Attribute.Component<'project-blocks.stat-item', true>;
    line_variant: Schema.Attribute.Enumeration<
      ['default', 'linear', 'step', 'multiple', 'dots']
    > &
      Schema.Attribute.DefaultTo<'default'>;
    pie_variant: Schema.Attribute.Enumeration<
      ['default', 'donut', 'donut-text', 'donut-active']
    > &
      Schema.Attribute.DefaultTo<'default'>;
    radar_variant: Schema.Attribute.Enumeration<
      ['default', 'dots', 'lines-only', 'circle', 'filled']
    > &
      Schema.Attribute.DefaultTo<'default'>;
    radial_variant: Schema.Attribute.Enumeration<
      ['default', 'stacked', 'text']
    > &
      Schema.Attribute.DefaultTo<'default'>;
    show_axes: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    show_dots: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    show_grid: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    show_labels: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    show_legend: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
  };
}

export interface ProjectBlocksVideo extends Struct.ComponentSchema {
  collectionName: 'components_project_blocks_videos';
  info: {
    description: '';
    displayName: 'video';
  };
  attributes: {
    caption: Schema.Attribute.Text;
    file: Schema.Attribute.Media<'files' | 'videos'>;
    url: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'about.business': AboutBusiness;
      'cv.chapter': CvChapter;
      'cv.languages': CvLanguages;
      'project-blocks.carousel': ProjectBlocksCarousel;
      'project-blocks.code-block': ProjectBlocksCodeBlock;
      'project-blocks.comparison-slider': ProjectBlocksComparisonSlider;
      'project-blocks.image': ProjectBlocksImage;
      'project-blocks.lottie': ProjectBlocksLottie;
      'project-blocks.rich-text': ProjectBlocksRichText;
      'project-blocks.snapshot': ProjectBlocksSnapshot;
      'project-blocks.snapshot-item': ProjectBlocksSnapshotItem;
      'project-blocks.stat-item': ProjectBlocksStatItem;
      'project-blocks.stats': ProjectBlocksStats;
      'project-blocks.video': ProjectBlocksVideo;
    }
  }
}
