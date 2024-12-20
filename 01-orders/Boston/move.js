"use strict";

/**
 * Скрипт стикеров
 * автор: Человек-Шаман
 * version: 1.0.2
 */
var hvStickerPack2 = {
  loading: false,
  data: [],
  userData: [],
  isOpened: false,
  init: function (url, isAddingAvaliable) {
    if ($("move#1").length === 0) return;
    this.url = url;
    this.handleTdClick = this.handleTdClick.bind(this);
    this.setLoading = this.setLoading.bind(this);
    this.parseLoadedData = this.parseLoadedData.bind(this);
    this.handleTabsClick = this.handleTabsClick.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.handleAddButtonClick = this.handleAddButtonClick.bind(this);
    this.handleContentClick = this.handleContentClick.bind(this);
    this.addStyle();
  },
  addStyle: function () {
    var style = $('<link rel="stylesheet" href="https://forumstatic.ru/files/001a/e7/a4/46538.css?v=11">');
    $("head").append(style);
  },
  renderModal: function () {
    if (this.modal) {
      this.toggleModal(true);
      return;
    }

    this.modalContainer = $('<div class="hvStickerPackModalContainer"></div>');
    this.modal = $('<div class="hvStickerPackModal"></div>');
    this.modalTabs = $('<div class="hvStickerPackModalTabs"></div>');
    this.modalContent = $('<div class="hvStickerPackModalContent"></div>');
    this.addContainer = $('<div class="hvStickerPackModalAdd hidden"></div>');
    this.stickerInput = $('<input class="hvStickerPackModalInput" type="text" placeholder="Url стикера">');
    this.addStickerButton = $('<input class="hvStickerPackModalAddButton" type="button" value="+">');
    this.addContainer.append(this.stickerInput);
    this.addContainer.append(this.addStickerButton);
    this.modal.append(this.modalContent);
    this.modal.append(this.addContainer);
    this.modal.append(this.modalTabs);
    this.modalContainer.append(this.modal);
    this.data.forEach(function (pack) {
      if (pack.stickers.length === 0) {
        return;
      }

      hvStickerPack2.modalTabs.append('<div class="hvStickerPackModalTab" data-pack="' + pack.name + '">' + pack.name + "</div>");
    });
    hvStickerPack2.modalTabs.append('<div class="hvStickerPackModalTab" data-pack="Свои">Свои</div>');
    this.modalTabs.on("click", this.handleTabsClick);
    this.modalContent.on("click", this.handleContentClick);
    this.addStickerButton.on("click", this.handleAddButtonClick);
    $("body").append(this.modalContainer);
    this.toggleModal(true);
  },
  toggleModal: function (isOpened) {
    var open = typeof isOpened !== "undefined" ? Boolean(isOpened) : !this.isOpened;

    if (open) {
      var offset = $("#post").offset();
      this.modalContainer.css({
        position: "absolute",
        top: offset.top,
        left: offset.left
      });
      this.modal.css({
        width: $("#post").width()
      });
      this.setTab(this.data[0].name);
      $(document).on("click", this.handleOutsideClick);
    } else {
      $(document).off("click", this.handleOutsideClick);
    }

    this.modal.toggleClass("active", open);
    this.isOpened = open;
  },
  setTab: function (tabName) {
    var self = this;
    var isCustomTab = tabName === "Свои";
    $(this.modalTabs).find(".hvStickerPackModalTab").removeClass("active");
    $(this.modalTabs).find('.hvStickerPackModalTab[data-pack="' + tabName + '"]').addClass("active");
    var pack = isCustomTab ? {
      name: "Свои",
      stickers: this.userData
    } : this.data.find(function (pack) {
      return pack.name === tabName;
    });
    $(self.modalContent).empty();
    pack.stickers.forEach(function (url) {
      $(self.modalContent).append('<div class="hvStickerPackItem" data-sticker="' + url + '"><img src="' + url + '" onClick="smile(\'[img]' + url + "[/img]')\">" + (isCustomTab ? '<span class="hvStickerPackRemoveItem" title="Удалить">x</span>' : "") + "</div>");
    });
    this.toggleAddTab(isCustomTab);
  },
  toggleAddTab: function (isCustom) {
    this.addContainer.toggleClass("hidden", !isCustom);
  },
  setLoading: function (isLoading) {
    this.loading = Boolean(isLoading);
  },
  parseLoadedData: function (data) {
    var stickerArray = data.split("\n");
    var pointer = 0;
    var pointerName = "Pack 1";
    stickerArray.forEach(function (str) {
      str = str.replace(String.fromCharCode(13), '');
      var isImg = /\.(gif|jpe?g|png)$/i.test(str);

      if (isImg) {
        if (!hvStickerPack2.data[pointer]) {
          hvStickerPack2.data[pointer] = {
            name: pointerName,
            stickers: []
          };
        }

        hvStickerPack2.data[pointer].stickers.push(str);
      } else {
        if (str === "") {
          pointerName = "Pack " + (hvStickerPack2.data.length + 1);
        } else {
          pointerName = str;
        }

          if (hvStickerPack2.data[pointer]) {
            pointer++;
          }
      }
    });
  },
  handleTdClick: function (event, url) {
    event.stopPropagation();

    if (this.loading) {
      return;
    }

     this.url = url;

    if (typeof(this.data) !="undefined" && this.data.length>0) {
      this.toggleModal();
      return;
    }

    this.setLoading(true);
    this.loadForumStickers();
    this.loadUserStickers();
  },
  handleTabsClick: function (event) {
    var target = $(event.target).closest(".hvStickerPackModalTab");

    if (target.length) {
      hvStickerPack2.setTab(target.attr("data-pack"));
    }
  },
  handleContentClick: function (event) {
    event.stopPropagation();
    var target = $(event.target).closest(".hvStickerPackRemoveItem");

    if (target.length) {
      var link = target.closest(".hvStickerPackItem").attr("data-sticker");
      var index = this.userData.indexOf(link);
      this.userData.splice(index, 1);
      this.setTab("Свои");
      this.setUserData();
    }
  },
  handleAddButtonClick: function () {
    var link = $(this.stickerInput).val();
    var isImg = /(^https?:\/\/.*\.(?:png|jpg|gif))$/.test(link);

    if (isImg && !this.userData.includes(link)) {
      this.userData.push(link);
      this.setUserData();
      this.setTab("Свои");
      $(this.stickerInput).val("");
    }
  },

  setUserData() {
    $.post("/api.php", {
      method: "storage.set",
      token: ForumAPITicket,
      key: "hvStickerPack2",
      value: JSON.stringify(this.userData)
    });
  },

  handleOutsideClick: function (event) {
    var target = $(event.target);

    if (!target.closest(".hvStickerPackModal").length) {
      hvStickerPack2.toggleModal(false);
    }
  },
  loadForumStickers: function () {
    $.get(this.url, function (data) {
      hvStickerPack2.parseLoadedData(data);
      hvStickerPack2.setLoading(false);
      hvStickerPack2.renderModal();
    }).fail(function () {
      $.jGrowl("Стикеры не грузятся, что-то пошло не так ? Может, поможет перезагрузка страницы?");
    });
  },
  loadUserStickers: function () {
    if (UserID === 1) {
      return;
    }

    $.ajax({
      async: false,
      url: "/api.php",
      data: {
        method: "storage.get",
        key: "hvStickerPack2"
      },
      success: function (result) {
        var response = result.response && result.response.storage && result.response.storage.data && result.response.storage.data.hvStickerPack2;

        if (response) {
          hvStickerPack2.userData = JSON.parse(response);
        }
      },
      error: function () {
        $.jGrowl("Твои стикеры не прогрузились, придется пользоваться форумными ?");
      }
    });
  }
};