import { transports, format, createLogger, Logger } from 'winston'

const Logger = (defaultMeta = {}): Logger =>
  createLogger({
    format: format.combine(format.timestamp(), format.prettyPrint()),
    defaultMeta,
    transports: [new transports.Console()],
  })

export { Logger }
