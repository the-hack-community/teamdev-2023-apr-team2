import { logger } from 'react-native-logs'

const config = {
  levels: {
    trace: 0,
    info: 1,
    silly: 2,
    error: 3,
    mad: 4,
  },
}

const log = logger.createLogger(config)

export default log.info
