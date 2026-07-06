module.exports = ({ env }) => ({
    upload: {
      config: {
        provider: "cloudinary",
        providerOptions: {
          cloud_name: env("CLOUDINARY_NAME"),
          api_key: env("CLOUDINARY_API_KEY"),
          api_secret: env("CLOUDINARY_API_SECRET"),
        },
        actionOptions: {
          upload: async (file) => {
            // Automatically set folder based on Strapi model type
            if (file.related && file.related.length > 0) {
              const modelName = file.related[0].collectionName;
              return { folder: `website/${modelName}` };
            }
            return { folder: "website/general" }; // Default fallback
          },
        },
        security: {
          maxFileSize: 10 * 1024 * 1024, // 10MB
        },
        breakpoints: {},
        allowedFileTypes: {
          image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/avif'],
          video: ['video/mp4', 'video/webm', 'video/ogg'],
          audio: ['audio/mpeg', 'audio/ogg', 'audio/wav'],
          file: ['application/pdf'],
        },
      },
    },
  });

export default () => ({});  