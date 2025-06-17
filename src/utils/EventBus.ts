class EventBus {
  events: Record<string, Set<(...args: any) => void>> = {}
  on(eventName: string, callback: (...args: any) => void) {
    (this.events[eventName] ??= new Set()).add(callback)
  }
  off(eventName: string, callback: (...args: any) => void) {
    this.events[eventName]?.delete(callback)
  }

  emit(eventName: string, ...args: any[]) {
    this.events[eventName]?.forEach(callback => callback(...args))
  }
  once(eventName: string, callback: (args: any) => void) {
    const handler = (args: any) => {
      callback(args)
      this.off(eventName, callback)
    }
    this.on(eventName, handler)
  }
}



export const bus = new EventBus()