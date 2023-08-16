const common = {
  smtp: {
    username: process.env.SMTP_USERNAME,
    password: process.env.SMTP_PASSWORD,
    sender: process.env.SMTP_SENDER
  },
  contact: process.env.CONTACT_EMAIL,
  user: {
    adminEmail: process.env.ADMIN_EMAIL,
    Username: process.env.ADMIN_USERNAME,
    adminPassword: process.env.ADMIN_PASSWORD,
  },
  client: {
    protocol: process.env.CLIENT_PROTOCOL,
    host: process.env.CLIENT_HOST,
    port: process.env.CLIENT_PORT,
    url: process.env.CLIENT_URL,
  },
  database: {
    host: process.env.DATABASE_HOST,
    port: (process.env.DATABASE_PORT && Number.parseInt(process.env.DATABASE_PORT)) || 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
    schema: process.env.DATABASE_SCHEMA,
    synchronize: true,
  },

  userSettings: {
    expiryDelay: {
      session: 14 * 24 * 60 * 60 * 1000, // 14 days
      passwordReset: 14 * 24 * 60 * 60 * 1000, // 14 days
    },
  },
}
export const env = { ...common }

/*
 * |--------------------------------------------------------------------------------------------------------------------
 * | App Env
 * |--------------------------------------------------------------------------------------------------------------------
 */

switch (process.env.APP_ENV) {
  case 'local': {
    Object.assign(env, {
      isLocal: true,
    })
    break
  }
  case 'test': {
    Object.assign(env, {
      isTest: true,
    })
    break
  }
  case 'staging': {
    Object.assign(env, {
      isStaging: true,
    })
    break
  }
  case 'dev': {
    Object.assign(env, {
      isDevelop: true,
    })
    break
  }
  // Live
  default: {
    Object.assign(env, {
      isLive: true,
    })
    break
  }
}

/*
 * |--------------------------------------------------------------------------------------------------------------------
 * | Node Env
 * |--------------------------------------------------------------------------------------------------------------------
 */

switch (process.env.NODE_ENV) {
  case 'development': {
    Object.assign(env, {
      isDev: true,
    })
    break
  }
  // Production
  default: {
    Object.assign(env, {
      isProd: true,
    })
    break
  }
}
