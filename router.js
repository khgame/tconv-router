const compose = require('@khgame/tconv/tconv/src/compose')

class eventRouter {
  constructor () {
    this.router = {}
    this.handler = {}
  }

  getRouter (event) {
    if (!this.router[event]) {
      this.router[event] = {
        claim: [],
        check: []
      }
    }
    return this.router[event];
  }

  claim (event, cb) {
    let mid = this.getRouter(event)
    mid.claim.push(cb)
    return this
  }

  check (event, cb) {
    let mid = this.getRouter(event)
    mid.check.push(cb)
    return this
  }

  middleware () {
    for (let key in this.router) {
      this.handler[key] = compose([...this.router[key].claim, ...this.router[key].check])
    }
    return async (ctx, next) => {
      let eventName = ctx.params.event
      await this.handler[eventName](ctx)
      await next()
    }
  }
}

module.exports = eventRouter
