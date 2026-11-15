import { assertUploadProvider } from '../src/utils/local-environment';

const uploadRules = {
  sizeLimit: 100 * 1024 * 1024,
  security: {
    allowedTypes: [
      'image/*',
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/quicktime',
      'audio/mpeg',
      'audio/ogg',
      'audio/wav',
      'application/json',
      'application/pdf',
    ],
  },
};

export default ({ env }) => {
  const provider = assertUploadProvider(process.env);

  if (provider === 'local') {
    return {
      upload: {
        config: {
          provider: 'local',
          ...uploadRules,
        },
      },
    };
  }

  return {
    upload: {
      config: {
        provider: 'cloudinary',
        providerOptions: {
          cloud_name: env('CLOUDINARY_NAME'),
          api_key: env('CLOUDINARY_API_KEY'),
          api_secret: env('CLOUDINARY_API_SECRET'),
        },
        actionOptions: {
          upload: async (file) => {
            if (file.related && file.related.length > 0) {
              const modelName = file.related[0].collectionName;
              return { folder: `website/${modelName}` };
            }
            return { folder: 'website/general' };
          },
        },
        ...uploadRules,
      },
    },
  };
};
