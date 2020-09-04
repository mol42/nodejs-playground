"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("news_entries", [
      {
        id: 1,
        title: "Deneme Haberi",
        small_image: "https://res.cloudinary.com/dc4xkhq6h/image/upload/v1598502568/messi_20200827_256x145_evpexp.jpg",
        content: `Bu haber bir denemedir<br />
            Buradaki text HTML de olabilir ya da Markdown taglerini içeren text de olabilir.<br /> 
            Seçim size kalmış önemli olan güvenlik amacıyla content içine alan metni her zaman 
            XSS saldırılarına karşı kontrol ederek kaydedin.<br />
            Yani content içinde script çalıştırabilecek tagleri temizleyin.`,
        date : 20200903,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        title: "1 ay öncesine ait deneme haberi",
        small_image: "https://res.cloudinary.com/dc4xkhq6h/image/upload/v1598502568/messi_20200827_256x145_evpexp.jpg",
        content: `1 ay öncesine ait deneme haberidir<br />
            Buradaki text HTML de olabilir ya da Markdown taglerini içeren text de olabilir.<br /> 
            Seçim size kalmış önemli olan güvenlik amacıyla content içine alan metni her zaman 
            XSS saldırılarına karşı kontrol ederek kaydedin.<br />
            Yani content içinde script çalıştırabilecek tagleri temizleyin.`,
        date : 20200801,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
