const DBManager = {
    modelCache: null,
    setModelCache: function (modelCache) {
      this.modelCache = modelCache;
    },
    getModelCache: function () {
      return this.modelCache;
    }
  };
  
  module.exports = DBManager;
  