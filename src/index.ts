/**
* Telegraf session using Prisma as datastore
* @author gh:waptik
**/


import type { Context, Middleware } from "telegraf"
import { PrismaClient } from "@prisma/client"

 type SessionOptions<C> = {
  sessionName: string
  modelName: string
  sessionKeyFn: (ctx: C) => string | undefined
}

export const session = <C extends Context>(
  db: PrismaClient,
  sessionOptions?: Partial<SessionOptions<C>>
): Middleware<C> => {
  const options: SessionOptions<C> = {
    sessionName: "session",
    modelName: 'session', 
    sessionKeyFn: ({ from, chat }: C) =>  from && chat && `${from.id}:${chat.id}`,
    ...sessionOptions,
  }

  const model = db[options.modelName]

  const saveSession = async (key: string, data: any) =>
    await model.upsert({
      where: {
        key,
      },
      update: { data },
      create: { key, data },
    })
  const getSession = async (key: string) => {
    const res = await model.findUnique({ where: { key } })
    return res?.data
  }

  const { sessionName } = options

  return async (ctx: C, next) => {
    const key = options.sessionKeyFn(ctx)

    if(!key) {
        return next?.()
    }
    
    let data =  await getSession(key)

    Object.defineProperty(ctx, sessionName, {
        get: function () {
            return data
        },
        set: function (value:any) {
            data = Object.assign({}, value)
        }
    })

   let out = await next()
    await saveSession(key, data)
    return out
  }
}