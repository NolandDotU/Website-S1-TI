// ============================================
// service/factory/ServiceFactory.js
// Factory pattern untuk create service instances
// ============================================
import LecturerService from "../serviceLecturer.js";

class ServiceFactory {
  constructor() {
    this.services = new Map();
  }

  register(name, service) {
    this.services.set(name, service);
  }

  get(name) {
    if (!this.services.has(name)) {
      throw new Error(`Service ${name} not registered`);
    }
    return this.services.get(name);
  }

  has(name) {
    return this.services.has(name);
  }
}

const serviceFactory = new ServiceFactory();

serviceFactory.register("lecturer", LecturerService);

export default serviceFactory;
