// Generated by CoffeeScript 1.3.3
(function() {

  window.page_prev_content = null;

  $(document).ready(function() {
    var page;
    console.log("here we go...");
    buildPagesMenu();
    $(".dropdown-toggle").dropdown();
    window.editor = new EpicEditor({
      basePath: "/static/EpicEditor/epiceditor",
      file: {
        autoSave: 10000
      }
    });
    editor.load();
    page = getPageDefaults();
    $(".page-link-title-original").val(page.link_title);
    setPage(page);
    renderPage(page);
    $(".page-link-title").change(function(e) {
      var modal, original_link_title;
      page = getPage();
      console.log("link_title changed");
      original_link_title = $(".page-link-title-original").val();
      if (original_link_title != page.link_title) {
        modal = $("#confirm-change-link-title-modal");
        modal.modal('show');
        window.auto_save_okay = false;
        modal.find(".btn-confirm").click(function(e) {
          window.auto_save_okay = true;
          return modal.modal('hide');
        });
        return modal.find(".btn-cancel").click(function(e) {
          window.auto_save_okay = true;
          modal.modal('hide');
          return $("input.page-link-title").val(original_link_title);
        });
      }
    });
    $("#fullscreen-button").click(function(e) {
      return editor.setFullscreen(true);
    });
    $("#preview-button").click(function(e) {
      page = getPage();
      if (page.type === "custom") {
        editor.preview();
      } else {
        setPage(page);
      }
      $(".if-view-mode").show();
      return $(".if-edit-mode").hide();
    });
    $("#edit-button").click(function(e) {
      page = getPage();
      if (page.type === "custom") {
        editor.edit();
      }
      $(".if-view-mode").hide();
      return $(".if-edit-mode").show();
    });
    $("#save-button").click(function(e) {
      page = getPage();
      console.log("saving link title as " + page.link_title);
      return savePage(page);
    });
    $("#add-button").click(function(e) {
      return jQuery.post("/add_page", null, function(e) {
        return window.location.href = e.redirect_url;
      });
    });
    $("#remove-button").click(function(e) {
      var modal;
      modal = $("#confirm-delete-modal");
      modal.modal('show');
      modal.find(".btn-confirm").click(function(e) {
        var original_link_title;
        window.auto_save_okay = false;
        modal.modal('hide');
        original_link_title = $(".page-link-title-original").val();
        return jQuery.post("/pages/" + original_link_title + "/remove", null, function(e) {
          return window.location.href = e.redirect_url;
        });
      });
      return modal.find(".btn-cancel").click(function(e) {
        window.auto_save_okay = true;
        modal.modal('hide');
        return $("input.page-link-title").val(original_link_title);
      });
    });
    editor.on("save", function() {
      var original_link_title;
      original_link_title = $(".page-link-title-original").val();
      if (auto_save_okay) {
        return savePage(getPage());
      }
    });
    $(this).keydown(function(e) {
      return console.log("Keycode: " + e.keyCode);
    });
    return $(".page-type").change(function(e) {
      console.log("page type changed");
      page = getPage();
      return renderPage(page);
    });
  });

  window.renderPage = function(page) {
    if (window.logged_in) {
      $(".if-logged-in").show();
      $(".if-not-logged-in").hide();
      $(".if-view-mode").hide();
    } else {
      $(".if-logged-in").hide();
      $(".if-not-logged-in").show();
    }
    if (page.type === "custom") {
      $(".if-custom-page").show();
      return $(".if-not-custom-page").hide();
    } else {
      $(".if-not-custom-page").show();
      return $(".if-custom-page").hide();
    }
  };

  window.buildPagesMenu = function() {
    $(".pages-nav-list").html("<li><a id='add-button'>New Page</a></li><li class='divider'></li>");
    return jQuery.get("/pages", function(pages) {
      var page, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = pages.length; _i < _len; _i++) {
        page = pages[_i];
        _results.push($(".pages-nav-list").append("<li><a href='" + page.url + "'>" + page.link_title + "</a></li>"));
      }
      return _results;
    });
  };

  window.auto_save_okay = true;

  window.savePage = function(page, success_callback) {
    return $.ajax({
      type: 'POST',
      url: "/pages/" + page.link_title_original + "/edit",
      data: page,
      success: function(e) {
        var prettyTime;
        if (e.redirect_url != null) {
          window.location.href = e.redirect_url;
        }
        if (success_callback != null) {
          success_callback(e);
        }
        prettyTime = (new XDate()).toString("dddd, h:mm:ss tt");
        $(".page-last-saved-time").text("Page was last saved on " + prettyTime);
        return {
          dataType: "json"
        };
      }
    });
  };

  window.setPage = function(data) {
    $(".page-link-title").val(data.link_title);
    $(".page-title").val(data.title).text(data.title);
    $(".page-subtitle").val(data.subtitle).text(data.subtitle);
    $(".page-type").val(data.type);
    $(".page-content").html(marked(data.content));
    editor.setText(data.content);
    return void 0;
  };

  window.getPage = function() {
    var data;
    data = {
      link_title_original: $("input.page-link-title-original").val(),
      link_title: $("input.page-link-title").val(),
      title: $("input.page-title").val(),
      subtitle: $("input.page-subtitle").val(),
      type: $("select.page-type").val(),
      content: editor.getText()
    };
    return data;
  };

}).call(this);
