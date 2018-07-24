window.SessionView = countlyView.extend({
    beforeRender: function() {
        return $.when(countlySession.initialize(), countlyTotalUsers.initialize("users")).then(function () {});
    },
    renderCommon:function (isRefresh) {

        var sessionData = countlySession.getSessionData(),
            sessionDP = countlySession.getSessionDP();

        this.templateData = {
            "page-title":jQuery.i18n.map["sessions.title"],
            "logo-class":"sessions",
            "big-numbers":{
                "count":3,
                "items":[
                    {
                        "title":jQuery.i18n.map["common.total-sessions"],
                        "total":sessionData.usage["total-sessions"].total,
                        "trend":sessionData.usage["total-sessions"].trend,
                        "help":"sessions.total-sessions"
                    },
                    {
                        "title":jQuery.i18n.map["common.new-sessions"],
                        "total":sessionData.usage["new-users"].total,
                        "trend":sessionData.usage["new-users"].trend,
                        "help":"sessions.new-sessions"
                    },
                    {
                        "title":jQuery.i18n.map["common.unique-sessions"],
                        "total":sessionData.usage["total-users"].total,
                        "trend":sessionData.usage["total-users"].trend,
                        "help":"sessions.unique-sessions"
                    }
                ]
            }
        };

        if (!isRefresh) {
            $(this.el).html(this.template(this.templateData));
            countlyCommon.drawTimeGraph(sessionDP.chartDP, "#dashboard-graph");

            this.dtable = $('.d-table').dataTable($.extend({}, $.fn.dataTable.defaults, {
                "aaData": sessionDP.chartData,
                "aoColumns": [
                    { "mData": "date", "sType":"customDate", "sTitle": jQuery.i18n.map["common.date"] },
                    { "mData": "t", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.total-sessions"] },
                    { "mData": "n", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.new-sessions"] },
                    { "mData": "u", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.unique-sessions"] }
                ]
            }));

            $(".d-table").stickyTableHeaders();
        }
    },
    refresh:function () {
        var self = this;
        $.when(this.beforeRender()).then(function () {
            if (app.activeView != self) {
                return false;
            }
            self.renderCommon(true);
            newPage = $("<div>" + self.template(self.templateData) + "</div>");
            $(self.el).find("#big-numbers-container").html(newPage.find("#big-numbers-container").html());

            var sessionDP = countlySession.getSessionDP();
            countlyCommon.drawTimeGraph(sessionDP.chartDP, "#dashboard-graph");
            CountlyHelpers.refreshTable(self.dtable, sessionDP.chartData);

            app.localize();
        });
    }
});

window.UserView = countlyView.extend({
    beforeRender: function() {
        return $.when(countlySession.initialize(), countlyTotalUsers.initialize("users")).then(function () {});
    },
    renderCommon:function (isRefresh) {
        var sessionData = countlySession.getSessionData(),
            userDP = countlySession.getUserDP();

        this.templateData = {
            "page-title":jQuery.i18n.map["users.title"],
            "logo-class":"users",
            "big-numbers":{
                "count":3,
                "items":[
                    {
                        "title":jQuery.i18n.map["common.total-users"],
                        "total":sessionData.usage["total-users"].total,
                        "trend":sessionData.usage["total-users"].trend,
                        "help":"users.total-users"
                    },
                    {
                        "title":jQuery.i18n.map["common.new-users"],
                        "total":sessionData.usage["new-users"].total,
                        "trend":sessionData.usage["new-users"].trend,
                        "help":"users.new-users"
                    },
                    {
                        "title":jQuery.i18n.map["common.returning-users"],
                        "total":sessionData.usage["returning-users"].total,
                        "trend":sessionData.usage["returning-users"].trend,
                        "help":"users.returning-users"
                    }
                ]
            }
        };

        if (!isRefresh) {
            $(this.el).html(this.template(this.templateData));
            countlyCommon.drawTimeGraph(userDP.chartDP, "#dashboard-graph");
            this.dtable = $('.d-table').dataTable($.extend({}, $.fn.dataTable.defaults, {
                "aaData": userDP.chartData,
                "aoColumns": [
                    { "mData": "date", "sType":"customDate", "sTitle": jQuery.i18n.map["common.date"] },
                    { "mData": "u", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.total-users"] },
                    { "mData": "n", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.new-users"] },
                    { "mData": "returning", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.returning-users"] }
                ]
            }));

            $(".d-table").stickyTableHeaders();
        }
    },
    refresh:function () {
        var self = this;
        $.when(this.beforeRender()).then(function () {
            if (app.activeView != self) {
                return false;
            }
            self.renderCommon(true);
            newPage = $("<div>" + self.template(self.templateData) + "</div>");

            $(self.el).find("#big-numbers-container").replaceWith(newPage.find("#big-numbers-container"));

            var userDP = countlySession.getUserDP();
            countlyCommon.drawTimeGraph(userDP.chartDP, "#dashboard-graph");
            CountlyHelpers.refreshTable(self.dtable, userDP.chartData);

            app.localize();
        });
    }
});

window.LoyaltyView = countlyView.extend({
    beforeRender: function() {
        return $.when(countlySession.initialize()).then(function () {});
    },
    renderCommon:function (isRefresh) {
        var loyaltyData = countlySession.getRangeData("l", "l-ranges", countlySession.explainLoyaltyRange, countlySession.getLoyalityRange());

        this.templateData = {
            "page-title":jQuery.i18n.map["user-loyalty.title"],
            "logo-class":"loyalty",
            "chart-helper":"loyalty.chart",
            "table-helper":"loyalty.table"
        };

        if (!isRefresh) {
            $(this.el).html(this.template(this.templateData));

            countlyCommon.drawGraph(loyaltyData.chartDP, "#dashboard-graph", "bar");

            this.dtable = $('.d-table').dataTable($.extend({}, $.fn.dataTable.defaults, {
                "aaData": loyaltyData.chartData,
                "aoColumns": [
                    { "mData": "l", sType:"loyalty", "sTitle": jQuery.i18n.map["user-loyalty.table.session-count"] },
                    { "mData": "t", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.number-of-users"] },
                    { "mData": "percent", "sType":"percent", "sTitle": jQuery.i18n.map["common.percent"] }
                ]
            }));

            $(".d-table").stickyTableHeaders();
        }
    },
    refresh:function () {
        var self = this;
        $.when(countlySession.initialize()).then(function () {
            if (app.activeView != self) {
                return false;
            }

            var loyaltyData = countlySession.getRangeData("l", "l-ranges", countlySession.explainLoyaltyRange, countlySession.getLoyalityRange());
            countlyCommon.drawGraph(loyaltyData.chartDP, "#dashboard-graph", "bar");
            CountlyHelpers.refreshTable(self.dtable, loyaltyData.chartData);
        });
    }
});

window.CountriesView = countlyView.extend({
    cityView: (store.get("countly_location_city")) ? store.get("countly_active_app") : false,
    initialize:function () {
        this.curMap = "map-list-sessions";
        this.template = Handlebars.compile($("#template-analytics-countries").html());
    },
    beforeRender: function() {
        this.maps = {
            "map-list-sessions": {id:'total', label:jQuery.i18n.map["sidebar.analytics.sessions"], type:'number', metric:"t"},
            "map-list-users": {id:'total', label:jQuery.i18n.map["sidebar.analytics.users"], type:'number', metric:"u"},
            "map-list-new": {id:'total', label:jQuery.i18n.map["common.table.new-users"], type:'number', metric:"n"}
        };
        return $.when(countlySession.initialize(), countlyCity.initialize(), countlyTotalUsers.initialize("countries"), countlyTotalUsers.initialize("cities"), countlyTotalUsers.initialize("users")).then(function () {});
    },
    drawTable: function() {
        var tableFirstColTitle = (this.cityView) ? jQuery.i18n.map["countries.table.city"] : jQuery.i18n.map["countries.table.country"],
            locationData,
            firstCollData = "country_flag"

        if (this.cityView) {
            locationData = countlyCity.getLocationData();
            firstCollData = "cities";
        } else {
            locationData = countlyLocation.getLocationData();
        }

        var activeApp = countlyGlobal['apps'][countlyCommon.ACTIVE_APP_ID];

        this.dtable = $('.d-table').dataTable($.extend({}, $.fn.dataTable.defaults, {
            "aaData": locationData,
            "aoColumns": [
                { "mData": firstCollData, "sTitle": tableFirstColTitle },
                { "mData": "t", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.total-sessions"] },
                { "mData": "u", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.total-users"] },
                { "mData": "n", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.new-users"] }
            ]
        }));

        $(".d-table").stickyTableHeaders();
    },
    renderCommon:function (isRefresh) {
        var sessionData = countlySession.getSessionData();

        this.templateData = {
            "page-title":jQuery.i18n.map["countries.title"],
            "logo-class":"countries",
            "big-numbers":{
                "count":3,
                "items":[
                    {
                        "title":jQuery.i18n.map["common.total-sessions"],
                        "total":sessionData.usage["total-sessions"].total,
                        "trend":sessionData.usage["total-sessions"].trend,
                        "help":"countries.total-sessions",
                        "radio-button-id": "map-list-sessions",
                        "radio-button-class": (this.curMap == "map-list-sessions")? "selected" : ""
                    },
                    {
                        "title":jQuery.i18n.map["common.total-users"],
                        "total":sessionData.usage["total-users"].total,
                        "trend":sessionData.usage["total-users"].trend,
                        "help":"countries.total-users",
                        "radio-button-id": "map-list-users",
                        "radio-button-class": (this.curMap == "map-list-users")? "selected" : ""
                    },
                    {
                        "title":jQuery.i18n.map["common.new-users"],
                        "total":sessionData.usage["new-users"].total,
                        "trend":sessionData.usage["new-users"].trend,
                        "help":"countries.new-users",
                        "radio-button-id": "map-list-new",
                        "radio-button-class": (this.curMap == "map-list-new")? "selected" : ""
                    }
                ]
            },
            "chart-helper":"countries.chart",
            "table-helper":"countries.table"
        };

        var self = this;
        $(document).unbind('selectMapCountry').bind('selectMapCountry', function () {
            $("#country-toggle").trigger("click");
        });

        if (!isRefresh) {
            $(this.el).html(this.template(this.templateData));

            if (countlyGlobal["config"].use_google) {
                if (this.cityView) {
                    countlyCity.drawGeoChart({height:450, metric:self.maps[self.curMap]});
                } else {
                    countlyLocation.drawGeoChart({height:450, metric:self.maps[self.curMap]});
                }

                $(".widget").removeClass("google-disabled");
            }
            else{
                $(".widget").addClass("google-disabled");
            }

            this.drawTable();

            if (countlyCommon.CITY_DATA === false) {
                store.set("countly_location_city", false);
            }
            
            $("#country-toggle").on('click', function () {
                if ($(this).hasClass("country_selected")) {
                    self.cityView = false;
                    if(countlyGlobal["config"].use_google)
                        countlyLocation.drawGeoChart({height:450, metric:self.maps[self.curMap]});
                    $(this).removeClass("country_selected");
                    self.refresh(true);
                    store.set("countly_location_city", false);
                    if(countlyGlobal['apps'][countlyCommon.ACTIVE_APP_ID] && countlyGlobal['apps'][countlyCommon.ACTIVE_APP_ID].country)
                        $(this).text(jQuery.i18n.map["common.show"]+" "+countlyLocation.getCountryName(countlyGlobal['apps'][countlyCommon.ACTIVE_APP_ID].country));
                    else
                        $(this).text(jQuery.i18n.map["common.show"]+" "+jQuery.i18n.map["countries.table.country"]);
                } else {
                    self.cityView = true;
                    if(countlyGlobal["config"].use_google)
                        countlyCity.drawGeoChart({height:450, metric:self.maps[self.curMap]});
                    $(this).addClass("country_selected");
                    self.refresh(true);
                    store.set("countly_location_city", true);
                    $(this).html('<i class="fa fa-chevron-left" aria-hidden="true"></i>'+jQuery.i18n.map["countries.back-to-list"]);
                }
            });
            
            if(self.cityView){
                $("#country-toggle").html('<i class="fa fa-chevron-left" aria-hidden="true"></i>'+jQuery.i18n.map["countries.back-to-list"]).addClass("country_selected");
            }
            else{
                if(countlyGlobal['apps'][countlyCommon.ACTIVE_APP_ID] && countlyGlobal['apps'][countlyCommon.ACTIVE_APP_ID].country)
                    $("#country-toggle").text(jQuery.i18n.map["common.show"]+" "+countlyLocation.getCountryName(countlyGlobal['apps'][countlyCommon.ACTIVE_APP_ID].country));
                else
                    $("#country-toggle").text(jQuery.i18n.map["common.show"]+" "+jQuery.i18n.map["countries.table.country"]);
            }
            
            $(".geo-switch").on("click", ".radio", function(){
                $(".geo-switch").find(".radio").removeClass("selected");
                $(this).addClass("selected");
                self.curMap = $(this).data("id");

                if (self.cityView)
                    countlyCity.refreshGeoChart(self.maps[self.curMap]);
                else
                    countlyLocation.refreshGeoChart(self.maps[self.curMap]);
            });
        }
    },
    refresh:function (isToggle) {
        var self = this;
        $.when(this.beforeRender()).then(function () {
            if (app.activeView != self) {
                return false;
            }
            self.renderCommon(true);
            newPage = $("<div>" + self.template(self.templateData) + "</div>");

            $(self.el).find("#big-numbers-container").replaceWith(newPage.find("#big-numbers-container"));

            if (isToggle) {
                self.drawTable();
            } else {
                var locationData;
                if (self.cityView) {
                    locationData = countlyCity.getLocationData();
                    if(countlyGlobal["config"].use_google)
                        countlyCity.refreshGeoChart(self.maps[self.curMap]);
                } else {
                    locationData = countlyLocation.getLocationData();
                    if(countlyGlobal["config"].use_google)
                        countlyLocation.refreshGeoChart(self.maps[self.curMap]);
                }

                CountlyHelpers.refreshTable(self.dtable, locationData);
            }

            app.localize();
        });
    }
});

window.FrequencyView = countlyView.extend({
    beforeRender: function() {
        return $.when(countlySession.initialize()).then(function () {});
    },
    renderCommon:function (isRefresh) {
        var frequencyData = countlySession.getRangeData("f", "f-ranges", countlySession.explainFrequencyRange, countlySession.getFrequencyRange());

        this.templateData = {
            "page-title":jQuery.i18n.map["session-frequency.title"],
            "logo-class":"frequency",
            "chart-helper":"frequency.chart",
            "table-helper":"frequency.table"
        };

        if (!isRefresh) {
            $(this.el).html(this.template(this.templateData));

            countlyCommon.drawGraph(frequencyData.chartDP, "#dashboard-graph", "bar");

            this.dtable = $('.d-table').dataTable($.extend({}, $.fn.dataTable.defaults, {
                "aaData": frequencyData.chartData,
                "aoColumns": [
                    { "mData": "f", sType:"frequency", "sTitle": jQuery.i18n.map["session-frequency.table.time-after"] },
                    { "mData": "t", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.number-of-sessions"] },
                    { "mData": "percent", "sType":"percent", "sTitle": jQuery.i18n.map["common.percent"] }
                ]
            }));

            $(".d-table").stickyTableHeaders();
        }
    },
    refresh:function () {
        var self = this;
        $.when(countlySession.initialize()).then(function () {
            if (app.activeView != self) {
                return false;
            }

            var frequencyData = countlySession.getRangeData("f", "f-ranges", countlySession.explainFrequencyRange, countlySession.getFrequencyRange());
            countlyCommon.drawGraph(frequencyData.chartDP, "#dashboard-graph", "bar");
            CountlyHelpers.refreshTable(self.dtable, frequencyData.chartData);
        });
    }
});

window.DeviceView = countlyView.extend({
    beforeRender: function() {
        return $.when(countlyDevice.initialize(), countlyDeviceDetails.initialize(), countlyTotalUsers.initialize("devices")).then(function () {});
    },
    pageScript:function () {
        app.localize();
    },
    renderCommon:function (isRefresh) {
        var deviceData = countlyDevice.getData();

        this.templateData = {
            "page-title":jQuery.i18n.map["devices.title"],
            "logo-class":"devices",
            "graph-type-double-pie":true,
            "pie-titles":{
                "left":jQuery.i18n.map["common.total-users"],
                "right":jQuery.i18n.map["common.new-users"]
            },
            "bars":[
                {
                    "title":jQuery.i18n.map["common.bar.top-platform"],
                    "data":countlyDeviceDetails.getBarsWPercentageOfTotal("os"),
                    "help":"dashboard.top-platforms"
                },
                {
                    "title":jQuery.i18n.map["common.bar.top-platform-version"],
                    "data":countlyDeviceDetails.getBarsWPercentageOfTotal("os_versions"),
                    "help":"devices.platform-versions2"
                },
                {
                    "title":jQuery.i18n.map["common.bar.top-resolution"],
                    "data":countlyDeviceDetails.getBarsWPercentageOfTotal("resolutions"),
                    "help":"dashboard.top-resolutions"
                }
            ],
            "chart-helper":"devices.chart",
            "table-helper":""
        };

        if (!isRefresh) {
            $(this.el).html(this.template(this.templateData));
            this.pageScript();

            countlyCommon.drawGraph(deviceData.chartDPTotal, "#dashboard-graph", "pie");
            countlyCommon.drawGraph(deviceData.chartDPNew, "#dashboard-graph2", "pie");

            this.dtable = $('.d-table').dataTable($.extend({}, $.fn.dataTable.defaults, {
                "aaData": deviceData.chartData,
                "aoColumns": [
                    { "mData": "devices", "sTitle": jQuery.i18n.map["devices.table.device"] },
                    { "mData": "t", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.total-sessions"] },
                    { "mData": "u", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.total-users"] },
                    { "mData": "n", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.new-users"] }
                ]
            }));

            $(".d-table").stickyTableHeaders();
        }
    },
    refresh:function () {
        var self = this;
        $.when(this.beforeRender()).then(function () {
            if (app.activeView != self) {
                return false;
            }
            self.renderCommon(true);

            newPage = $("<div>" + self.template(self.templateData) + "</div>");
            $(self.el).find(".dashboard-summary").replaceWith(newPage.find(".dashboard-summary"));

            var deviceData = countlyDevice.getData();

            countlyCommon.drawGraph(deviceData.chartDPTotal, "#dashboard-graph", "pie");
            countlyCommon.drawGraph(deviceData.chartDPNew, "#dashboard-graph2", "pie");
            CountlyHelpers.refreshTable(self.dtable, deviceData.chartData);

            self.pageScript();
        });
    }
});

window.PlatformView = countlyView.extend({
    activePlatform:{},
    beforeRender: function() {
        return $.when(countlyDeviceDetails.initialize(), countlyTotalUsers.initialize("platforms"), countlyTotalUsers.initialize("platform_versions")).then(function () {});
    },
    pageScript:function () {
        var self = this;

        app.localize();
    },
    renderCommon:function (isRefresh) {
        var self = this;
        var platformData = countlyDeviceDetails.getPlatformData();
        platformData.chartData.sort(function(a,b) {return (a.os_ > b.os_) ? 1 : ((b.os_ > a.os_) ? -1 : 0);});
        var chartHTML = "";

        if (platformData && platformData.chartDP && platformData.chartDP.dp && platformData.chartDP.dp.length) {
            chartHTML += '<div class="hsb-container top"><div class="label">Platforms</div><div class="chart"><svg id="hsb-platforms"></svg></div></div>';

            for (var i = 0; i < platformData.chartDP.dp.length; i++) {
                chartHTML += '<div class="hsb-container"><div class="label">'+ platformData.chartDP.dp[i].label +'</div><div class="chart"><svg id="hsb-platform'+ i +'"></svg></div></div>';
            }
        }
        
        if(!this.activePlatform[countlyCommon.ACTIVE_APP_ID])
            this.activePlatform[countlyCommon.ACTIVE_APP_ID] = (platformData.chartData[0]) ? platformData.chartData[0].os_ : "";
        
        var segments = [];
        for(var i = 0; i < platformData.chartData.length; i++){
            segments.push({name:platformData.chartData[i].os_, value:platformData.chartData[i].origos_})
        }

        this.templateData = {
            "page-title":jQuery.i18n.map["platforms.title"],
            "segment-title":jQuery.i18n.map["platforms.table.platform-version-for"],
            "logo-class":"platforms",
            "chartHTML": chartHTML,
            "isChartEmpty": (chartHTML)? false : true,
            "chart-helper":"platform-versions.chart",
            "table-helper":"",
            "two-tables": true,
            "active-segment": this.activePlatform[countlyCommon.ACTIVE_APP_ID],
            "segmentation": segments
        };

        if (!isRefresh) {
            $(this.el).html(this.template(this.templateData));
            this.pageScript();

            this.dtable = $('#dataTableOne').dataTable($.extend({}, $.fn.dataTable.defaults, {
                "aaData": platformData.chartData,
                "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
                    $(nRow).data("name", aData.origos_);
                    $(nRow).addClass("os-rows");
                },
                "aoColumns": [
                    { "mData": "os_", "sTitle": jQuery.i18n.map["platforms.table.platform"] },
                    { "mData": "t", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.total-sessions"] },
                    { "mData": "u", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.total-users"] },
                    { "mData": "n", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.new-users"] }
                ]
            }));
            
            $(".segmentation-widget .segmentation-option").on("click", function () {
                self.activePlatform[countlyCommon.ACTIVE_APP_ID] = $(this).data("value");
                self.refresh();
            });

            countlyCommon.drawHorizontalStackedBars(platformData.chartDP.dp, "#hsb-platforms");

            if (platformData && platformData.chartDP) {
                for (var i = 0; i < platformData.chartDP.dp.length; i++) {
                    var tmpOsVersion = countlyDeviceDetails.getOSSegmentedData(platformData.chartDP.dp[i].label, false, "os_versions", "platform_versions");

                    countlyCommon.drawHorizontalStackedBars(tmpOsVersion.chartDP.dp, "#hsb-platform"+i, i);
                }
            }

            var oSVersionData = countlyDeviceDetails.getOSSegmentedData(this.activePlatform[countlyCommon.ACTIVE_APP_ID], false, "os_versions", "platform_versions");
            this.dtableTwo = $('#dataTableTwo').dataTable($.extend({}, $.fn.dataTable.defaults, {
                "aaData": oSVersionData.chartData,
                "aoColumns": [
                    { "mData": "os_versions", "sTitle": jQuery.i18n.map["platforms.table.platform-version"] },
                    { "mData": "t", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.total-sessions"] },
                    { "mData": "u", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.total-users"] },
                    { "mData": "n", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.new-users"] }
                ]
            }));

            $("#dataTableTwo").stickyTableHeaders();
        }
    },
    refresh:function () {
        var self = this;
        $.when(this.beforeRender()).then(function () {
            if (app.activeView != self) {
                return false;
            }
            self.renderCommon(true);

            var oSVersionData = countlyDeviceDetails.getOSSegmentedData(self.activePlatform[countlyCommon.ACTIVE_APP_ID], false, "os_versions", "platform_versions"),
                platformData = countlyDeviceDetails.getPlatformData(),
                newPage = $("<div>" + self.template(self.templateData) + "</div>");

            $(self.el).find(".widget-content").replaceWith(newPage.find(".widget-content"));
            $(self.el).find(".dashboard-summary").replaceWith(newPage.find(".dashboard-summary"));

            countlyCommon.drawHorizontalStackedBars(platformData.chartDP.dp, "#hsb-platforms");

            if (platformData && platformData.chartDP) {
                for (var i = 0; i < platformData.chartDP.dp.length; i++) {
                    var tmpOsVersion = countlyDeviceDetails.getOSSegmentedData(platformData.chartDP.dp[i].label, false, "os_versions", "platform_versions");

                    countlyCommon.drawHorizontalStackedBars(tmpOsVersion.chartDP.dp, "#hsb-platform"+i, i);
                }
            }

            CountlyHelpers.refreshTable(self.dtable, platformData.chartData);
            CountlyHelpers.refreshTable(self.dtableTwo, oSVersionData.chartData);

            self.pageScript();
        });
    }
});

window.AppVersionView = countlyView.extend({
    beforeRender: function() {
        return $.when(countlyDeviceDetails.initialize(), countlyTotalUsers.initialize("app_versions")).then(function () {});
    },
    renderCommon:function (isRefresh) {
        var appVersionData = countlyAppVersion.getData(false, true);
        this.templateData = {
            "page-title":jQuery.i18n.map["app-versions.title"],
            "logo-class":"app-versions",
            "chart-helper":"app-versions.chart",
            "table-helper":""
        };

        if (!isRefresh) {
            $(this.el).html(this.template(this.templateData));
            countlyCommon.drawGraph(appVersionData.chartDP, "#dashboard-graph", "bar");

            this.dtable = $('.d-table').dataTable($.extend({}, $.fn.dataTable.defaults, {
                "aaData": appVersionData.chartData,
                "aoColumns": [
                    { "mData": "app_versions", "sTitle": jQuery.i18n.map["app-versions.table.app-version"] },
                    { "mData": "t", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.total-sessions"] },
                    { "mData": "u", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.total-users"] },
                    { "mData": "n", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.new-users"] }
                ]
            }));

            $(".d-table").stickyTableHeaders();
        }
    },
    refresh:function () {
        var self = this;
        $.when(this.beforeRender()).then(function () {
            if (app.activeView != self) {
                return false;
            }

            var appVersionData = countlyAppVersion.getData(false, true);
            countlyCommon.drawGraph(appVersionData.chartDP, "#dashboard-graph", "bar");
            CountlyHelpers.refreshTable(self.dtable, appVersionData.chartData);
        });
    }
});

window.CarrierView = countlyView.extend({
    beforeRender: function() {
        return $.when(countlyCarrier.initialize(), countlyTotalUsers.initialize("carriers")).then(function () {});
    },
    renderCommon:function (isRefresh) {
        var carrierData = countlyCarrier.getData();

        this.templateData = {
            "page-title":jQuery.i18n.map["carriers.title"],
            "logo-class":"carriers",
            "graph-type-double-pie":true,
            "pie-titles":{
                "left":jQuery.i18n.map["common.total-users"],
                "right":jQuery.i18n.map["common.new-users"]
            },
            "chart-helper":"carriers.chart",
            "table-helper":""
        };

        if (!isRefresh) {
            $(this.el).html(this.template(this.templateData));

            countlyCommon.drawGraph(carrierData.chartDPTotal, "#dashboard-graph", "pie");
            countlyCommon.drawGraph(carrierData.chartDPNew, "#dashboard-graph2", "pie");

            this.dtable = $('.d-table').dataTable($.extend({}, $.fn.dataTable.defaults, {
                "aaData": carrierData.chartData,
                "aoColumns": [
                    { "mData": "carriers", "sTitle": jQuery.i18n.map["carriers.table.carrier"] },
                    { "mData": "t", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.total-sessions"] },
                    { "mData": "u", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.total-users"] },
                    { "mData": "n", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.new-users"] }
                ]
            }));

            $(".d-table").stickyTableHeaders();
        }
    },
    refresh:function () {
        var self = this;
        $.when(this.beforeRender()).then(function () {
            if (app.activeView != self) {
                return false;
            }

            var carrierData = countlyCarrier.getData();
            countlyCommon.drawGraph(carrierData.chartDPTotal, "#dashboard-graph", "pie");
            countlyCommon.drawGraph(carrierData.chartDPNew, "#dashboard-graph2", "pie");
            CountlyHelpers.refreshTable(self.dtable, carrierData.chartData);
        });
    }
});

window.ResolutionView = countlyView.extend({
    beforeRender: function() {
        return $.when(countlyDeviceDetails.initialize(), countlyTotalUsers.initialize("resolutions")).then(function () {});
    },
    renderCommon:function (isRefresh) {
        var resolutionData = countlyDeviceDetails.getResolutionData();

        this.templateData = {
            "page-title":jQuery.i18n.map["resolutions.title"],
            "logo-class":"resolutions",
            "graph-type-double-pie":true,
            "pie-titles":{
                "left":jQuery.i18n.map["common.total-users"],
                "right":jQuery.i18n.map["common.new-users"]
            },
            "chart-helper":"resolutions.chart"
        };

        if (!isRefresh) {
            $(this.el).html(this.template(this.templateData));

            countlyCommon.drawGraph(resolutionData.chartDPTotal, "#dashboard-graph", "pie");
            countlyCommon.drawGraph(resolutionData.chartDPNew, "#dashboard-graph2", "pie");

            this.dtable = $('.d-table').dataTable($.extend({}, $.fn.dataTable.defaults, {
                "aaData": resolutionData.chartData,
                "aoColumns": [
                    { "mData": "resolution", "sTitle": jQuery.i18n.map["resolutions.table.resolution"], "bSortable": false },
                    { "mData": function(row){return parseInt(row.width.replace(/<(?:.|\n)*?>/gm, ''))}, sType:"numeric","sTitle": jQuery.i18n.map["resolutions.table.width"] },
                    { "mData": function(row){return parseInt(row.height.replace(/<(?:.|\n)*?>/gm, ''))}, sType:"numeric","sTitle": jQuery.i18n.map["resolutions.table.height"] },
                    { "mData": "t", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.total-sessions"] },
                    { "mData": "u", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.total-users"] },
                    { "mData": "n", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.new-users"] }
                ]
            }));

            $(".d-table").stickyTableHeaders();
        }
    },
    refresh:function () {
        var self = this;
        $.when(this.beforeRender()).then(function () {
            if (app.activeView != self) {
                return false;
            }
            self.renderCommon(true);

            newPage = $("<div>" + self.template(self.templateData) + "</div>");
            $(self.el).find(".dashboard-summary").replaceWith(newPage.find(".dashboard-summary"));

            var resolutionData = countlyDeviceDetails.getResolutionData();

            countlyCommon.drawGraph(resolutionData.chartDPTotal, "#dashboard-graph", "pie");
            countlyCommon.drawGraph(resolutionData.chartDPNew, "#dashboard-graph2", "pie");
            CountlyHelpers.refreshTable(self.dtable, resolutionData.chartData);
        });
    }
});

window.DurationView = countlyView.extend({
    beforeRender: function() {
        return $.when(countlySession.initialize()).then(function () {});
    },
    renderCommon:function (isRefresh) {
        var durationData = countlySession.getRangeData("ds", "d-ranges", countlySession.explainDurationRange, countlySession.getDurationRange());

        this.templateData = {
            "page-title":jQuery.i18n.map["session-duration.title"],
            "logo-class":"durations",
            "chart-helper":"durations.chart",
            "table-helper":"durations.table"
        };

        if (!isRefresh) {
            $(this.el).html(this.template(this.templateData));

            countlyCommon.drawGraph(durationData.chartDP, "#dashboard-graph", "bar");

            this.dtable = $('.d-table').dataTable($.extend({}, $.fn.dataTable.defaults, {
                "aaData": durationData.chartData,
                "aoColumns": [
                    { "mData": "ds", sType:"session-duration", "sTitle": jQuery.i18n.map["session-duration.table.duration"] },
                    { "mData": "t", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.number-of-sessions"] },
                    { "mData": "percent", "sType":"percent", "sTitle": jQuery.i18n.map["common.percent"] }
                ]
            }));

            $(".d-table").stickyTableHeaders();
        }
    },
    refresh:function () {
        var self = this;
        $.when(countlySession.initialize()).then(function () {
            if (app.activeView != self) {
                return false;
            }

            var durationData = countlySession.getRangeData("ds", "d-ranges", countlySession.explainDurationRange, countlySession.getDurationRange());
            countlyCommon.drawGraph(durationData.chartDP, "#dashboard-graph", "bar");
            CountlyHelpers.refreshTable(self.dtable, durationData.chartData);
        });
    }
});

window.ManageAppsView = countlyView.extend({
    initialize:function () {
        this.template = Handlebars.compile($("#template-management-applications").html());
        this.templatePlugins = Handlebars.compile($("#template-management-plugins").html());
        this.appManagementViews = [];
    },
    beforeRender: function() {
        if (this.appManagementViews.length === 0) {
            var self = this;
            Object.keys(app.appManagementViews).forEach(function(plugin){
                var Clas = app.appManagementViews[plugin].view,
                    view = new Clas();
                view.setAppId(countlyCommon.ACTIVE_APP_ID);
                self.appManagementViews.push(view);
            });
            return $.when.apply($, this.appManagementViews.map(function(view){
                return view.beforeRender();
            }));
        } else {
            return $.when();
        }
    },
    getAppCategories: function(){
        return { 1:jQuery.i18n.map["application-category.books"], 2:jQuery.i18n.map["application-category.business"], 3:jQuery.i18n.map["application-category.education"], 4:jQuery.i18n.map["application-category.entertainment"], 5:jQuery.i18n.map["application-category.finance"], 6:jQuery.i18n.map["application-category.games"], 7:jQuery.i18n.map["application-category.health-fitness"], 8:jQuery.i18n.map["application-category.lifestyle"], 9:jQuery.i18n.map["application-category.medical"], 10:jQuery.i18n.map["application-category.music"], 11:jQuery.i18n.map["application-category.navigation"], 12:jQuery.i18n.map["application-category.news"], 13:jQuery.i18n.map["application-category.photography"], 14:jQuery.i18n.map["application-category.productivity"], 15:jQuery.i18n.map["application-category.reference"], 16:jQuery.i18n.map["application-category.social-networking"], 17:jQuery.i18n.map["application-category.sports"], 18:jQuery.i18n.map["application-category.travel"], 19:jQuery.i18n.map["application-category.utilities"], 20:jQuery.i18n.map["application-category.weather"]};
    },
    getTimeZones: function(){
        return { "AF":{"n":"Afghanistan","z":[{"(GMT+04:30) Kabul":"Asia/Kabul"}]}, "AL":{"n":"Albania","z":[{"(GMT+01:00) Tirane":"Europe/Tirane"}]}, "DZ":{"n":"Algeria","z":[{"(GMT+01:00) Algiers":"Africa/Algiers"}]}, "AS":{"n":"American Samoa","z":[{"(GMT-11:00) Pago Pago":"Pacific/Pago_Pago"}]}, "AD":{"n":"Andorra","z":[{"(GMT+01:00) Andorra":"Europe/Andorra"}]}, "AO":{"n":"Angola","z":[{"(GMT+01:00) Luanda":"Africa/Luanda"}]}, "AI":{"n":"Anguilla","z":[{"(GMT-04:00) Anguilla":"America/Anguilla"}]}, "AQ":{"n":"Antarctica","z":[{"(GMT-04:00) Palmer":"Antarctica/Palmer"},{"(GMT-03:00) Rothera":"Antarctica/Rothera"},{"(GMT+03:00) Syowa":"Antarctica/Syowa"},{"(GMT+05:00) Mawson":"Antarctica/Mawson"},{"(GMT+06:00) Vostok":"Antarctica/Vostok"},{"(GMT+07:00) Davis":"Antarctica/Davis"},{"(GMT+08:00) Casey":"Antarctica/Casey"},{"(GMT+10:00) Dumont D'Urville":"Antarctica/DumontDUrville"}]}, "AG":{"n":"Antigua and Barbuda","z":[{"(GMT-04:00) Antigua":"America/Antigua"}]}, "AR":{"n":"Argentina","z":[{"(GMT-03:00) Buenos Aires":"America/Buenos_Aires"}]}, "AM":{"n":"Armenia","z":[{"(GMT+04:00) Yerevan":"Asia/Yerevan"}]}, "AW":{"n":"Aruba","z":[{"(GMT-04:00) Aruba":"America/Aruba"}]}, "AU":{"n":"Australia","z":[{"(GMT+08:00) Western Time - Perth":"Australia/Perth"},{"(GMT+09:30) Central Time - Adelaide":"Australia/Adelaide"},{"(GMT+09:30) Central Time - Darwin":"Australia/Darwin"},{"(GMT+10:00) Eastern Time - Brisbane":"Australia/Brisbane"},{"(GMT+10:00) Eastern Time - Hobart":"Australia/Hobart"},{"(GMT+10:00) Eastern Time - Melbourne, Sydney":"Australia/Sydney"}]}, "AT":{"n":"Austria","z":[{"(GMT+01:00) Vienna":"Europe/Vienna"}]}, "AZ":{"n":"Azerbaijan","z":[{"(GMT+04:00) Baku":"Asia/Baku"}]}, "BS":{"n":"Bahamas","z":[{"(GMT-05:00) Nassau":"America/Nassau"}]}, "BH":{"n":"Bahrain","z":[{"(GMT+03:00) Bahrain":"Asia/Bahrain"}]}, "BD":{"n":"Bangladesh","z":[{"(GMT+06:00) Dhaka":"Asia/Dhaka"}]}, "BB":{"n":"Barbados","z":[{"(GMT-04:00) Barbados":"America/Barbados"}]}, "BY":{"n":"Belarus","z":[{"(GMT+03:00) Minsk":"Europe/Minsk"}]}, "BE":{"n":"Belgium","z":[{"(GMT+01:00) Brussels":"Europe/Brussels"}]}, "BZ":{"n":"Belize","z":[{"(GMT-06:00) Belize":"America/Belize"}]}, "BJ":{"n":"Benin","z":[{"(GMT+01:00) Porto-Novo":"Africa/Porto-Novo"}]}, "BM":{"n":"Bermuda","z":[{"(GMT-04:00) Bermuda":"Atlantic/Bermuda"}]}, "BT":{"n":"Bhutan","z":[{"(GMT+06:00) Thimphu":"Asia/Thimphu"}]}, "BO":{"n":"Bolivia","z":[{"(GMT-04:00) La Paz":"America/La_Paz"}]}, "BA":{"n":"Bosnia and Herzegovina","z":[{"(GMT+01:00) Central European Time - Belgrade":"Europe/Sarajevo"}]}, "BW":{"n":"Botswana","z":[{"(GMT+02:00) Gaborone":"Africa/Gaborone"}]}, "BR":{"n":"Brazil","z":[{"(GMT-04:00) Boa Vista":"America/Boa_Vista"},{"(GMT-04:00) Campo Grande":"America/Campo_Grande"},{"(GMT-04:00) Cuiaba":"America/Cuiaba"},{"(GMT-04:00) Manaus":"America/Manaus"},{"(GMT-04:00) Porto Velho":"America/Porto_Velho"},{"(GMT-04:00) Rio Branco":"America/Rio_Branco"},{"(GMT-03:00) Araguaina":"America/Araguaina"},{"(GMT-03:00) Belem":"America/Belem"},{"(GMT-03:00) Fortaleza":"America/Fortaleza"},{"(GMT-03:00) Maceio":"America/Maceio"},{"(GMT-03:00) Recife":"America/Recife"},{"(GMT-03:00) Salvador":"America/Bahia"},{"(GMT-03:00) Sao Paulo":"America/Sao_Paulo"},{"(GMT-02:00) Noronha":"America/Noronha"}]}, "IO":{"n":"British Indian Ocean Territory","z":[{"(GMT+06:00) Chagos":"Indian/Chagos"}]}, "VG":{"n":"British Virgin Islands","z":[{"(GMT-04:00) Tortola":"America/Tortola"}]}, "BN":{"n":"Brunei","z":[{"(GMT+08:00) Brunei":"Asia/Brunei"}]}, "BG":{"n":"Bulgaria","z":[{"(GMT+02:00) Sofia":"Europe/Sofia"}]}, "BF":{"n":"Burkina Faso","z":[{"(GMT+00:00) Ouagadougou":"Africa/Ouagadougou"}]}, "BI":{"n":"Burundi","z":[{"(GMT+02:00) Bujumbura":"Africa/Bujumbura"}]}, "KH":{"n":"Cambodia","z":[{"(GMT+07:00) Phnom Penh":"Asia/Phnom_Penh"}]}, "CM":{"n":"Cameroon","z":[{"(GMT+01:00) Douala":"Africa/Douala"}]}, "CA":{"n":"Canada","z":[{"(GMT-07:00) Mountain Time - Dawson Creek":"America/Dawson_Creek"},{"(GMT-08:00) Pacific Time - Vancouver":"America/Vancouver"},{"(GMT-08:00) Pacific Time - Whitehorse":"America/Whitehorse"},{"(GMT-06:00) Central Time - Regina":"America/Regina"},{"(GMT-07:00) Mountain Time - Edmonton":"America/Edmonton"},{"(GMT-07:00) Mountain Time - Yellowknife":"America/Yellowknife"},{"(GMT-06:00) Central Time - Winnipeg":"America/Winnipeg"},{"(GMT-05:00) Eastern Time - Iqaluit":"America/Iqaluit"},{"(GMT-05:00) Eastern Time - Montreal":"America/Montreal"},{"(GMT-05:00) Eastern Time - Toronto":"America/Toronto"},{"(GMT-04:00) Atlantic Time - Halifax":"America/Halifax"},{"(GMT-03:30) Newfoundland Time - St. Johns":"America/St_Johns"}]}, "CV":{"n":"Cape Verde","z":[{"(GMT-01:00) Cape Verde":"Atlantic/Cape_Verde"}]}, "KY":{"n":"Cayman Islands","z":[{"(GMT-05:00) Cayman":"America/Cayman"}]}, "CF":{"n":"Central African Republic","z":[{"(GMT+01:00) Bangui":"Africa/Bangui"}]}, "TD":{"n":"Chad","z":[{"(GMT+01:00) Ndjamena":"Africa/Ndjamena"}]}, "CL":{"n":"Chile","z":[{"(GMT-06:00) Easter Island":"Pacific/Easter"},{"(GMT-04:00) Santiago":"America/Santiago"}]}, "CN":{"n":"China","z":[{"(GMT+08:00) China Time - Beijing":"Asia/Shanghai"}]}, "CX":{"n":"Christmas Island","z":[{"(GMT+07:00) Christmas":"Indian/Christmas"}]}, "CC":{"n":"Cocos [Keeling] Islands","z":[{"(GMT+06:30) Cocos":"Indian/Cocos"}]}, "CO":{"n":"Colombia","z":[{"(GMT-05:00) Bogota":"America/Bogota"}]}, "KM":{"n":"Comoros","z":[{"(GMT+03:00) Comoro":"Indian/Comoro"}]}, "CD":{"n":"Congo [DRC]","z":[{"(GMT+01:00) Kinshasa":"Africa/Kinshasa"},{"(GMT+02:00) Lubumbashi":"Africa/Lubumbashi"}]}, "CG":{"n":"Congo [Republic]","z":[{"(GMT+01:00) Brazzaville":"Africa/Brazzaville"}]}, "CK":{"n":"Cook Islands","z":[{"(GMT-10:00) Rarotonga":"Pacific/Rarotonga"}]}, "CR":{"n":"Costa Rica","z":[{"(GMT-06:00) Costa Rica":"America/Costa_Rica"}]}, "CI":{"n":"Côte d'Ivoire","z":[{"(GMT+00:00) Abidjan":"Africa/Abidjan"}]}, "HR":{"n":"Croatia","z":[{"(GMT+01:00) Central European Time - Belgrade":"Europe/Zagreb"}]}, "CU":{"n":"Cuba","z":[{"(GMT-05:00) Havana":"America/Havana"}]}, "CW":{"n":"Curaçao","z":[{"(GMT-04:00) Curacao":"America/Curacao"}]}, "CY":{"n":"Cyprus","z":[{"(GMT+02:00) Nicosia":"Asia/Nicosia"}]}, "CZ":{"n":"Czech Republic","z":[{"(GMT+01:00) Central European Time - Prague":"Europe/Prague"}]}, "DK":{"n":"Denmark","z":[{"(GMT+01:00) Copenhagen":"Europe/Copenhagen"}]}, "DJ":{"n":"Djibouti","z":[{"(GMT+03:00) Djibouti":"Africa/Djibouti"}]}, "DM":{"n":"Dominica","z":[{"(GMT-04:00) Dominica":"America/Dominica"}]}, "DO":{"n":"Dominican Republic","z":[{"(GMT-04:00) Santo Domingo":"America/Santo_Domingo"}]}, "EC":{"n":"Ecuador","z":[{"(GMT-06:00) Galapagos":"Pacific/Galapagos"},{"(GMT-05:00) Guayaquil":"America/Guayaquil"}]}, "EG":{"n":"Egypt","z":[{"(GMT+02:00) Cairo":"Africa/Cairo"}]}, "SV":{"n":"El Salvador","z":[{"(GMT-06:00) El Salvador":"America/El_Salvador"}]}, "GQ":{"n":"Equatorial Guinea","z":[{"(GMT+01:00) Malabo":"Africa/Malabo"}]}, "ER":{"n":"Eritrea","z":[{"(GMT+03:00) Asmera":"Africa/Asmera"}]}, "EE":{"n":"Estonia","z":[{"(GMT+02:00) Tallinn":"Europe/Tallinn"}]}, "ET":{"n":"Ethiopia","z":[{"(GMT+03:00) Addis Ababa":"Africa/Addis_Ababa"}]}, "FK":{"n":"Falkland Islands [Islas Malvinas]","z":[{"(GMT-03:00) Stanley":"Atlantic/Stanley"}]}, "FO":{"n":"Faroe Islands","z":[{"(GMT+00:00) Faeroe":"Atlantic/Faeroe"}]}, "FJ":{"n":"Fiji","z":[{"(GMT+12:00) Fiji":"Pacific/Fiji"}]}, "FI":{"n":"Finland","z":[{"(GMT+02:00) Helsinki":"Europe/Helsinki"}]}, "FR":{"n":"France","z":[{"(GMT+01:00) Paris":"Europe/Paris"}]}, "GF":{"n":"French Guiana","z":[{"(GMT-03:00) Cayenne":"America/Cayenne"}]}, "PF":{"n":"French Polynesia","z":[{"(GMT-10:00) Tahiti":"Pacific/Tahiti"},{"(GMT-09:30) Marquesas":"Pacific/Marquesas"},{"(GMT-09:00) Gambier":"Pacific/Gambier"}]}, "TF":{"n":"French Southern Territories","z":[{"(GMT+05:00) Kerguelen":"Indian/Kerguelen"}]}, "GA":{"n":"Gabon","z":[{"(GMT+01:00) Libreville":"Africa/Libreville"}]}, "GM":{"n":"Gambia","z":[{"(GMT+00:00) Banjul":"Africa/Banjul"}]}, "GE":{"n":"Georgia","z":[{"(GMT+04:00) Tbilisi":"Asia/Tbilisi"}]}, "DE":{"n":"Germany","z":[{"(GMT+01:00) Berlin":"Europe/Berlin"}]}, "GH":{"n":"Ghana","z":[{"(GMT+00:00) Accra":"Africa/Accra"}]}, "GI":{"n":"Gibraltar","z":[{"(GMT+01:00) Gibraltar":"Europe/Gibraltar"}]}, "GR":{"n":"Greece","z":[{"(GMT+02:00) Athens":"Europe/Athens"}]}, "GL":{"n":"Greenland","z":[{"(GMT-04:00) Thule":"America/Thule"},{"(GMT-03:00) Godthab":"America/Godthab"},{"(GMT-01:00) Scoresbysund":"America/Scoresbysund"},{"(GMT+00:00) Danmarkshavn":"America/Danmarkshavn"}]}, "GD":{"n":"Grenada","z":[{"(GMT-04:00) Grenada":"America/Grenada"}]}, "GP":{"n":"Guadeloupe","z":[{"(GMT-04:00) Guadeloupe":"America/Guadeloupe"}]}, "GU":{"n":"Guam","z":[{"(GMT+10:00) Guam":"Pacific/Guam"}]}, "GT":{"n":"Guatemala","z":[{"(GMT-06:00) Guatemala":"America/Guatemala"}]}, "GN":{"n":"Guinea","z":[{"(GMT+00:00) Conakry":"Africa/Conakry"}]}, "GW":{"n":"Guinea-Bissau","z":[{"(GMT+00:00) Bissau":"Africa/Bissau"}]}, "GY":{"n":"Guyana","z":[{"(GMT-04:00) Guyana":"America/Guyana"}]}, "HT":{"n":"Haiti","z":[{"(GMT-05:00) Port-au-Prince":"America/Port-au-Prince"}]}, "HN":{"n":"Honduras","z":[{"(GMT-06:00) Central Time - Tegucigalpa":"America/Tegucigalpa"}]}, "HK":{"n":"Hong Kong","z":[{"(GMT+08:00) Hong Kong":"Asia/Hong_Kong"}]}, "HU":{"n":"Hungary","z":[{"(GMT+01:00) Budapest":"Europe/Budapest"}]}, "IS":{"n":"Iceland","z":[{"(GMT+00:00) Reykjavik":"Atlantic/Reykjavik"}]}, "IN":{"n":"India","z":[{"(GMT+05:30) India Standard Time":"Asia/Calcutta"}]}, "ID":{"n":"Indonesia","z":[{"(GMT+07:00) Jakarta":"Asia/Jakarta"},{"(GMT+08:00) Makassar":"Asia/Makassar"},{"(GMT+09:00) Jayapura":"Asia/Jayapura"}]}, "IR":{"n":"Iran","z":[{"(GMT+03:30) Tehran":"Asia/Tehran"}]}, "IQ":{"n":"Iraq","z":[{"(GMT+03:00) Baghdad":"Asia/Baghdad"}]}, "IE":{"n":"Ireland","z":[{"(GMT+00:00) Dublin":"Europe/Dublin"}]}, "IL":{"n":"Israel","z":[{"(GMT+02:00) Jerusalem":"Asia/Jerusalem"}]}, "IT":{"n":"Italy","z":[{"(GMT+01:00) Rome":"Europe/Rome"}]}, "JM":{"n":"Jamaica","z":[{"(GMT-05:00) Jamaica":"America/Jamaica"}]}, "JP":{"n":"Japan","z":[{"(GMT+09:00) Tokyo":"Asia/Tokyo"}]}, "JO":{"n":"Jordan","z":[{"(GMT+02:00) Amman":"Asia/Amman"}]}, "KZ":{"n":"Kazakhstan","z":[{"(GMT+05:00) Aqtau":"Asia/Aqtau"},{"(GMT+05:00) Aqtobe":"Asia/Aqtobe"},{"(GMT+06:00) Almaty":"Asia/Almaty"}]}, "KE":{"n":"Kenya","z":[{"(GMT+03:00) Nairobi":"Africa/Nairobi"}]}, "KI":{"n":"Kiribati","z":[{"(GMT+12:00) Tarawa":"Pacific/Tarawa"},{"(GMT+13:00) Enderbury":"Pacific/Enderbury"},{"(GMT+14:00) Kiritimati":"Pacific/Kiritimati"}]}, "KW":{"n":"Kuwait","z":[{"(GMT+03:00) Kuwait":"Asia/Kuwait"}]}, "KG":{"n":"Kyrgyzstan","z":[{"(GMT+06:00) Bishkek":"Asia/Bishkek"}]}, "LA":{"n":"Laos","z":[{"(GMT+07:00) Vientiane":"Asia/Vientiane"}]}, "LV":{"n":"Latvia","z":[{"(GMT+02:00) Riga":"Europe/Riga"}]}, "LB":{"n":"Lebanon","z":[{"(GMT+02:00) Beirut":"Asia/Beirut"}]}, "LS":{"n":"Lesotho","z":[{"(GMT+02:00) Maseru":"Africa/Maseru"}]}, "LR":{"n":"Liberia","z":[{"(GMT+00:00) Monrovia":"Africa/Monrovia"}]}, "LY":{"n":"Libya","z":[{"(GMT+02:00) Tripoli":"Africa/Tripoli"}]}, "LI":{"n":"Liechtenstein","z":[{"(GMT+01:00) Vaduz":"Europe/Vaduz"}]}, "LT":{"n":"Lithuania","z":[{"(GMT+02:00) Vilnius":"Europe/Vilnius"}]}, "LU":{"n":"Luxembourg","z":[{"(GMT+01:00) Luxembourg":"Europe/Luxembourg"}]}, "MO":{"n":"Macau","z":[{"(GMT+08:00) Macau":"Asia/Macau"}]}, "MK":{"n":"Macedonia [FYROM]","z":[{"(GMT+01:00) Central European Time - Belgrade":"Europe/Skopje"}]}, "MG":{"n":"Madagascar","z":[{"(GMT+03:00) Antananarivo":"Indian/Antananarivo"}]}, "MW":{"n":"Malawi","z":[{"(GMT+02:00) Blantyre":"Africa/Blantyre"}]}, "MY":{"n":"Malaysia","z":[{"(GMT+08:00) Kuala Lumpur":"Asia/Kuala_Lumpur"}]}, "MV":{"n":"Maldives","z":[{"(GMT+05:00) Maldives":"Indian/Maldives"}]}, "ML":{"n":"Mali","z":[{"(GMT+00:00) Bamako":"Africa/Bamako"}]}, "MT":{"n":"Malta","z":[{"(GMT+01:00) Malta":"Europe/Malta"}]}, "MH":{"n":"Marshall Islands","z":[{"(GMT+12:00) Kwajalein":"Pacific/Kwajalein"},{"(GMT+12:00) Majuro":"Pacific/Majuro"}]}, "MQ":{"n":"Martinique","z":[{"(GMT-04:00) Martinique":"America/Martinique"}]}, "MR":{"n":"Mauritania","z":[{"(GMT+00:00) Nouakchott":"Africa/Nouakchott"}]}, "MU":{"n":"Mauritius","z":[{"(GMT+04:00) Mauritius":"Indian/Mauritius"}]}, "YT":{"n":"Mayotte","z":[{"(GMT+03:00) Mayotte":"Indian/Mayotte"}]}, "MX":{"n":"Mexico","z":[{"(GMT-07:00) Mountain Time - Hermosillo":"America/Hermosillo"},{"(GMT-08:00) Pacific Time - Tijuana":"America/Tijuana"},{"(GMT-07:00) Mountain Time - Chihuahua, Mazatlan":"America/Mazatlan"},{"(GMT-06:00) Central Time - Mexico City":"America/Mexico_City"}]}, "FM":{"n":"Micronesia","z":[{"(GMT+10:00) Truk":"Pacific/Truk"},{"(GMT+11:00) Kosrae":"Pacific/Kosrae"},{"(GMT+11:00) Ponape":"Pacific/Ponape"}]}, "MD":{"n":"Moldova","z":[{"(GMT+02:00) Chisinau":"Europe/Chisinau"}]}, "MC":{"n":"Monaco","z":[{"(GMT+01:00) Monaco":"Europe/Monaco"}]}, "MN":{"n":"Mongolia","z":[{"(GMT+07:00) Hovd":"Asia/Hovd"},{"(GMT+08:00) Choibalsan":"Asia/Choibalsan"},{"(GMT+08:00) Ulaanbaatar":"Asia/Ulaanbaatar"}]}, "MS":{"n":"Montserrat","z":[{"(GMT-04:00) Montserrat":"America/Montserrat"}]}, "MA":{"n":"Morocco","z":[{"(GMT+00:00) Casablanca":"Africa/Casablanca"}]}, "MZ":{"n":"Mozambique","z":[{"(GMT+02:00) Maputo":"Africa/Maputo"}]}, "MM":{"n":"Myanmar [Burma]","z":[{"(GMT+06:30) Rangoon":"Asia/Rangoon"}]}, "NA":{"n":"Namibia","z":[{"(GMT+01:00) Windhoek":"Africa/Windhoek"}]}, "NR":{"n":"Nauru","z":[{"(GMT+12:00) Nauru":"Pacific/Nauru"}]}, "NP":{"n":"Nepal","z":[{"(GMT+05:45) Katmandu":"Asia/Katmandu"}]}, "NL":{"n":"Netherlands","z":[{"(GMT+01:00) Amsterdam":"Europe/Amsterdam"}]}, "NC":{"n":"New Caledonia","z":[{"(GMT+11:00) Noumea":"Pacific/Noumea"}]}, "NZ":{"n":"New Zealand","z":[{"(GMT+12:00) Auckland":"Pacific/Auckland"}]}, "NI":{"n":"Nicaragua","z":[{"(GMT-06:00) Managua":"America/Managua"}]}, "NE":{"n":"Niger","z":[{"(GMT+01:00) Niamey":"Africa/Niamey"}]}, "NG":{"n":"Nigeria","z":[{"(GMT+01:00) Lagos":"Africa/Lagos"}]}, "NU":{"n":"Niue","z":[{"(GMT-11:00) Niue":"Pacific/Niue"}]}, "NF":{"n":"Norfolk Island","z":[{"(GMT+11:30) Norfolk":"Pacific/Norfolk"}]}, "KP":{"n":"North Korea","z":[{"(GMT+09:00) Pyongyang":"Asia/Pyongyang"}]}, "MP":{"n":"Northern Mariana Islands","z":[{"(GMT+10:00) Saipan":"Pacific/Saipan"}]}, "NO":{"n":"Norway","z":[{"(GMT+01:00) Oslo":"Europe/Oslo"}]}, "OM":{"n":"Oman","z":[{"(GMT+04:00) Muscat":"Asia/Muscat"}]}, "PK":{"n":"Pakistan","z":[{"(GMT+05:00) Karachi":"Asia/Karachi"}]}, "PW":{"n":"Palau","z":[{"(GMT+09:00) Palau":"Pacific/Palau"}]}, "PS":{"n":"Palestinian Territories","z":[{"(GMT+02:00) Gaza":"Asia/Gaza"}]}, "PA":{"n":"Panama","z":[{"(GMT-05:00) Panama":"America/Panama"}]}, "PG":{"n":"Papua New Guinea","z":[{"(GMT+10:00) Port Moresby":"Pacific/Port_Moresby"}]}, "PY":{"n":"Paraguay","z":[{"(GMT-04:00) Asuncion":"America/Asuncion"}]}, "PE":{"n":"Peru","z":[{"(GMT-05:00) Lima":"America/Lima"}]}, "PH":{"n":"Philippines","z":[{"(GMT+08:00) Manila":"Asia/Manila"}]}, "PN":{"n":"Pitcairn Islands","z":[{"(GMT-08:00) Pitcairn":"Pacific/Pitcairn"}]}, "PL":{"n":"Poland","z":[{"(GMT+01:00) Warsaw":"Europe/Warsaw"}]}, "PT":{"n":"Portugal","z":[{"(GMT-01:00) Azores":"Atlantic/Azores"},{"(GMT+00:00) Lisbon":"Europe/Lisbon"}]}, "PR":{"n":"Puerto Rico","z":[{"(GMT-04:00) Puerto Rico":"America/Puerto_Rico"}]}, "QA":{"n":"Qatar","z":[{"(GMT+03:00) Qatar":"Asia/Qatar"}]}, "RE":{"n":"Réunion","z":[{"(GMT+04:00) Reunion":"Indian/Reunion"}]}, "RO":{"n":"Romania","z":[{"(GMT+02:00) Bucharest":"Europe/Bucharest"}]}, "RU":{"n":"Russia","z":[{"(GMT+03:00) Moscow-01 - Kaliningrad":"Europe/Kaliningrad"},{"(GMT+04:00) Moscow+00":"Europe/Moscow"},{"(GMT+04:00) Moscow+00 - Samara":"Europe/Samara"},{"(GMT+06:00) Moscow+02 - Yekaterinburg":"Asia/Yekaterinburg"},{"(GMT+07:00) Moscow+03 - Omsk, Novosibirsk":"Asia/Omsk"},{"(GMT+08:00) Moscow+04 - Krasnoyarsk":"Asia/Krasnoyarsk"},{"(GMT+09:00) Moscow+05 - Irkutsk":"Asia/Irkutsk"},{"(GMT+10:00) Moscow+06 - Yakutsk":"Asia/Yakutsk"},{"(GMT+11:00) Moscow+07 - Yuzhno-Sakhalinsk":"Asia/Vladivostok"},{"(GMT+12:00) Moscow+08 - Magadan":"Asia/Magadan"},{"(GMT+12:00) Moscow+08 - Petropavlovsk-Kamchatskiy":"Asia/Kamchatka"}]}, "RW":{"n":"Rwanda","z":[{"(GMT+02:00) Kigali":"Africa/Kigali"}]}, "SH":{"n":"Saint Helena","z":[{"(GMT+00:00) St Helena":"Atlantic/St_Helena"}]}, "KN":{"n":"Saint Kitts and Nevis","z":[{"(GMT-04:00) St. Kitts":"America/St_Kitts"}]}, "LC":{"n":"Saint Lucia","z":[{"(GMT-04:00) St. Lucia":"America/St_Lucia"}]}, "PM":{"n":"Saint Pierre and Miquelon","z":[{"(GMT-03:00) Miquelon":"America/Miquelon"}]}, "VC":{"n":"Saint Vincent and the Grenadines","z":[{"(GMT-04:00) St. Vincent":"America/St_Vincent"}]}, "WS":{"n":"Samoa","z":[{"(GMT+13:00) Apia":"Pacific/Apia"}]}, "SM":{"n":"San Marino","z":[{"(GMT+01:00) Rome":"Europe/San_Marino"}]}, "ST":{"n":"São Tomé and Príncipe","z":[{"(GMT+00:00) Sao Tome":"Africa/Sao_Tome"}]}, "SA":{"n":"Saudi Arabia","z":[{"(GMT+03:00) Riyadh":"Asia/Riyadh"}]}, "SN":{"n":"Senegal","z":[{"(GMT+00:00) Dakar":"Africa/Dakar"}]}, "RS":{"n":"Serbia","z":[{"(GMT+01:00) Central European Time - Belgrade":"Europe/Belgrade"}]}, "SC":{"n":"Seychelles","z":[{"(GMT+04:00) Mahe":"Indian/Mahe"}]}, "SL":{"n":"Sierra Leone","z":[{"(GMT+00:00) Freetown":"Africa/Freetown"}]}, "SG":{"n":"Singapore","z":[{"(GMT+08:00) Singapore":"Asia/Singapore"}]}, "SK":{"n":"Slovakia","z":[{"(GMT+01:00) Central European Time - Prague":"Europe/Bratislava"}]}, "SI":{"n":"Slovenia","z":[{"(GMT+01:00) Central European Time - Belgrade":"Europe/Ljubljana"}]}, "SB":{"n":"Solomon Islands","z":[{"(GMT+11:00) Guadalcanal":"Pacific/Guadalcanal"}]}, "SO":{"n":"Somalia","z":[{"(GMT+03:00) Mogadishu":"Africa/Mogadishu"}]}, "ZA":{"n":"South Africa","z":[{"(GMT+02:00) Johannesburg":"Africa/Johannesburg"}]}, "GS":{"n":"South Georgia and the South Sandwich Islands","z":[{"(GMT-02:00) South Georgia":"Atlantic/South_Georgia"}]}, "KR":{"n":"South Korea","z":[{"(GMT+09:00) Seoul":"Asia/Seoul"}]}, "ES":{"n":"Spain","z":[{"(GMT+00:00) Canary Islands":"Atlantic/Canary"},{"(GMT+01:00) Ceuta":"Africa/Ceuta"},{"(GMT+01:00) Madrid":"Europe/Madrid"}]}, "LK":{"n":"Sri Lanka","z":[{"(GMT+05:30) Colombo":"Asia/Colombo"}]}, "SD":{"n":"Sudan","z":[{"(GMT+03:00) Khartoum":"Africa/Khartoum"}]}, "SR":{"n":"Suriname","z":[{"(GMT-03:00) Paramaribo":"America/Paramaribo"}]}, "SJ":{"n":"Svalbard and Jan Mayen","z":[{"(GMT+01:00) Oslo":"Arctic/Longyearbyen"}]}, "SZ":{"n":"Swaziland","z":[{"(GMT+02:00) Mbabane":"Africa/Mbabane"}]}, "SE":{"n":"Sweden","z":[{"(GMT+01:00) Stockholm":"Europe/Stockholm"}]}, "CH":{"n":"Switzerland","z":[{"(GMT+01:00) Zurich":"Europe/Zurich"}]}, "SY":{"n":"Syria","z":[{"(GMT+02:00) Damascus":"Asia/Damascus"}]}, "TW":{"n":"Taiwan","z":[{"(GMT+08:00) Taipei":"Asia/Taipei"}]}, "TJ":{"n":"Tajikistan","z":[{"(GMT+05:00) Dushanbe":"Asia/Dushanbe"}]}, "TZ":{"n":"Tanzania","z":[{"(GMT+03:00) Dar es Salaam":"Africa/Dar_es_Salaam"}]}, "TH":{"n":"Thailand","z":[{"(GMT+07:00) Bangkok":"Asia/Bangkok"}]}, "TL":{"n":"Timor-Leste","z":[{"(GMT+09:00) Dili":"Asia/Dili"}]}, "TG":{"n":"Togo","z":[{"(GMT+00:00) Lome":"Africa/Lome"}]}, "TK":{"n":"Tokelau","z":[{"(GMT+14:00) Fakaofo":"Pacific/Fakaofo"}]}, "TO":{"n":"Tonga","z":[{"(GMT+13:00) Tongatapu":"Pacific/Tongatapu"}]}, "TT":{"n":"Trinidad and Tobago","z":[{"(GMT-04:00) Port of Spain":"America/Port_of_Spain"}]}, "TN":{"n":"Tunisia","z":[{"(GMT+01:00) Tunis":"Africa/Tunis"}]}, "TR":{"n":"Turkey","z":[{"(GMT+03:00) Istanbul":"Europe/Istanbul"}]}, "TM":{"n":"Turkmenistan","z":[{"(GMT+05:00) Ashgabat":"Asia/Ashgabat"}]}, "TC":{"n":"Turks and Caicos Islands","z":[{"(GMT-05:00) Grand Turk":"America/Grand_Turk"}]}, "TV":{"n":"Tuvalu","z":[{"(GMT+12:00) Funafuti":"Pacific/Funafuti"}]}, "UM":{"n":"U.S. Minor Outlying Islands","z":[{"(GMT-11:00) Midway":"Pacific/Midway"},{"(GMT-10:00) Johnston":"Pacific/Johnston"},{"(GMT+12:00) Wake":"Pacific/Wake"}]}, "VI":{"n":"U.S. Virgin Islands","z":[{"(GMT-04:00) St. Thomas":"America/St_Thomas"}]}, "UG":{"n":"Uganda","z":[{"(GMT+03:00) Kampala":"Africa/Kampala"}]}, "UA":{"n":"Ukraine","z":[{"(GMT+02:00) Kiev":"Europe/Kiev"}]}, "AE":{"n":"United Arab Emirates","z":[{"(GMT+04:00) Dubai":"Asia/Dubai"}]}, "GB":{"n":"United Kingdom","z":[{"(GMT+00:00) GMT (no daylight saving)":"Etc/GMT"},{"(GMT+00:00) London":"Europe/London"}]}, "US":{"n":"United States","z":[{"(GMT-10:00) Hawaii Time":"Pacific/Honolulu"},{"(GMT-09:00) Alaska Time":"America/Anchorage"},{"(GMT-07:00) Mountain Time - Arizona":"America/Phoenix"},{"(GMT-08:00) Pacific Time":"America/Los_Angeles"},{"(GMT-07:00) Mountain Time":"America/Denver"},{"(GMT-06:00) Central Time":"America/Chicago"},{"(GMT-05:00) Eastern Time":"America/New_York"}]}, "UY":{"n":"Uruguay","z":[{"(GMT-03:00) Montevideo":"America/Montevideo"}]}, "UZ":{"n":"Uzbekistan","z":[{"(GMT+05:00) Tashkent":"Asia/Tashkent"}]}, "VU":{"n":"Vanuatu","z":[{"(GMT+11:00) Efate":"Pacific/Efate"}]}, "VA":{"n":"Vatican City","z":[{"(GMT+01:00) Rome":"Europe/Vatican"}]}, "VE":{"n":"Venezuela","z":[{"(GMT-04:30) Caracas":"America/Caracas"}]}, "VN":{"n":"Vietnam","z":[{"(GMT+07:00) Hanoi":"Asia/Saigon"}]}, "WF":{"n":"Wallis and Futuna","z":[{"(GMT+12:00) Wallis":"Pacific/Wallis"}]}, "EH":{"n":"Western Sahara","z":[{"(GMT+00:00) El Aaiun":"Africa/El_Aaiun"}]}, "YE":{"n":"Yemen","z":[{"(GMT+03:00) Aden":"Asia/Aden"}]}, "ZM":{"n":"Zambia","z":[{"(GMT+02:00) Lusaka":"Africa/Lusaka"}]}, "ZW":{"n":"Zimbabwe","z":[{"(GMT+02:00) Harare":"Africa/Harare"}]} };
    },
    renderCommon:function () {
        var appTypes = {}, self = this;
        for(var i in app.appTypes){
            appTypes[i] = jQuery.i18n.map["management-applications.types."+i] || i;
        }
        $(this.el).html(this.template({
            admin_apps:countlyGlobal['admin_apps'],
            app_types:appTypes
        }));

        var appCategories = this.getAppCategories();
        var timezones = this.getTimeZones();

        var appId = countlyCommon.ACTIVE_APP_ID;
        if(!countlyGlobal['admin_apps'][appId]){
            for(var i in countlyGlobal['admin_apps']){
                appId = i;
                break;
            }
        }
        $("#app-management-bar .app-container").removeClass("active");
        $("#app-management-bar .app-container[data-id='" + appId + "']").addClass("active");
        
        $(".select-app-types").on("click",".item", function(){
            app.onAppManagementSwitch($("#app-edit-id").val(), $(this).data("value"));
            if ($(this).parents('#add-new-app').length) {
                app.onAppAddTypeSwitch($(this).data('value'));
            }
        });
        
        for(var i in app.appSettings){
            if(app.appSettings[i] && app.appSettings[i].toInject)
                app.appSettings[i].toInject();
        }

        function initAppManagement(appId) {
            if (jQuery.isEmptyObject(countlyGlobal['apps'])) {
                showAdd();
                $("#no-app-warning").show();
                return false;
            } else if (jQuery.isEmptyObject(countlyGlobal['admin_apps'])) {
                showAdd();
                return false;
            } else {
                hideAdd();

                if (countlyGlobal['admin_apps'][appId]) {
                    $("#delete-app").show();
                } else {
                    $("#delete-app").hide();
                }
            }

            if ($("#new-install-overlay").is(":visible")) {
                $("#no-app-warning").hide();
                //$("#first-app-success").show();
                $("#new-install-overlay").fadeOut();
                countlyCommon.setActiveApp(appId);
                $("#active-app-icon").css("background-image", "url('"+countlyGlobal["cdn"]+"appimages/" + appId + ".png')");
                $("#active-app-name").text(countlyGlobal['apps'][appId].name);
                app.onAppSwitch(appId, true);
                app.sidebar.init();
            }
            if(countlyGlobal["config"] && countlyGlobal["config"].code && $("#code-countly").length){
                $("#code-countly").show();
            }
            
            app.onAppManagementSwitch(appId);

            $("#app-edit-id").val(appId);
            $("#view-app").find(".widget-header .title").text(countlyGlobal['apps'][appId].name);
            $("#app-edit-name").find(".read span").text(countlyGlobal['apps'][appId].name);
            $("#app-edit-name").find(".edit input").val(countlyGlobal['apps'][appId].name);
            $("#app-edit-key").find(".read").text(countlyGlobal['apps'][appId].key);
            $("#app-edit-key").find(".edit input").val(countlyGlobal['apps'][appId].key);
            $("#app-edit-salt").find(".read").text(countlyGlobal['apps'][appId].checksum_salt || "");
            $("#app-edit-salt").find(".edit input").val(countlyGlobal['apps'][appId].checksum_salt || "");
            $("#view-app-id").text(appId);
            $("#app-edit-type").find(".cly-select .text").text(appTypes[countlyGlobal['apps'][appId].type]);
            $("#app-edit-type").find(".cly-select .text").data("value", countlyGlobal['apps'][appId].type);
            $("#app-edit-type").find(".read").text(appTypes[countlyGlobal['apps'][appId].type]);
            $("#app-edit-category").find(".cly-select .text").text(appCategories[countlyGlobal['apps'][appId].category]);
            $("#app-edit-category").find(".cly-select .text").data("value", countlyGlobal['apps'][appId].category);
            $("#app-edit-timezone").find(".cly-select .text").data("value", countlyGlobal['apps'][appId].timezone);
            $("#app-edit-category").find(".read").text(appCategories[countlyGlobal['apps'][appId].category]);
            $("#app-edit-image").find(".read .logo").css({"background-image":'url("'+countlyGlobal["cdn"]+'appimages/' + appId + '.png")'});
            $("#view-app .app-read-settings").each(function(){
                var id = $(this).data('id');
                if(app.appSettings[id] && app.appSettings[id].toDisplay)
                    app.appSettings[id].toDisplay(appId, this);
                else if(typeof countlyGlobal['apps'][appId][id] !== "undefined")
                    $(this).text(countlyGlobal['apps'][appId][id]);
            });
            $("#view-app .app-write-settings").each(function(){
                var id = $(this).data('id');
                if(app.appSettings[id] && app.appSettings[id].toInput)
                    app.appSettings[id].toInput(appId, this);
                else if(typeof countlyGlobal['apps'][appId][id] !== "undefined")
                    $(this).val(countlyGlobal['apps'][appId][id]);
            });
            var appTimezone = timezones[countlyGlobal['apps'][appId].country];

            for (var i = 0; i < appTimezone.z.length; i++) {
                for (var tzone in appTimezone.z[i]) {
                    if (appTimezone.z[i][tzone] == countlyGlobal['apps'][appId].timezone) {
                        var appEditTimezone = $("#app-edit-timezone").find(".read"),
                            appCountryCode = countlyGlobal['apps'][appId].country;
                        appEditTimezone.find(".flag").css({"background-image":"url("+countlyGlobal["cdn"]+"images/flags/" + appCountryCode.toLowerCase() + ".png)"});
                        appEditTimezone.find(".country").text(appTimezone.n);
                        appEditTimezone.find(".timezone").text(tzone);
                        initCountrySelect("#app-edit-timezone", appCountryCode, tzone, appTimezone.z[i][tzone]);
                        break;
                    }
                }
            }

            self.el.find('.app-details-plugins').html(self.templatePlugins({
                plugins: Object.keys(app.appManagementViews).map(function(plugin, i) {
                    return {index: i, title: app.appManagementViews[plugin].title};
                })
            }));
            self.el.find('.app-details-plugins').off('remove').on('remove', function() {
                self.appManagementViews = [];
            });
            self.appManagementViews.forEach(function(view, i){
                view.el = $(self.el.find('.app-details-plugins form')[i]);
                view.setAppId(appId);
                view.beforeRender().then(view.render.bind(view));
            });
            self.el.find('.app-details-plugins > div').accordion({active: false, collapsible: true, autoHeight: false});
            self.el.find('.app-details-plugins > div').off('accordionactivate').on('accordionactivate', function(event, ui){
                var index = parseInt(ui.oldHeader.data('index'));
                self.appManagementViews[index].afterCollapse();
            });
            self.el.find('.app-details-plugins > div').off('accordionbeforeactivate').on('accordionbeforeactivate', function(event, ui){
                var index = parseInt(ui.newHeader.data('index'));
                self.appManagementViews[index].beforeExpand();
            });
            
            function joinUsers(users){
                var ret = "";
                if(users && users.length){
                    for(var i = 0; i < users.length; i++){
                        ret += "<a href='#/manage/users/"+users[i]._id+"' class='table-link-user green'>";
                        if(users[i].full_name && users[i].full_name != "")
                            ret += users[i].full_name;
                        else if(users[i].username && users[i].username != "")
                            ret += users[i].username;
                        else
                            ret += users[i]._id;
                        ret += "</a>";
                        ret += ", ";
                    }
                    ret = ret.substring(0, ret.length - 2);
                }
                return ret;
            }
            $("#app_details").off("click").on("click", function(){
                var dialog = CountlyHelpers.loading(jQuery.i18n.map["common.loading"]);
                $.ajax({
                    type:"GET",
                    url:countlyCommon.API_PARTS.apps.r + '/details',
                    data:{
                        app_id:appId,
                        api_key:countlyGlobal['member'].api_key
                    },
                    dataType:"json",
                    success:function (result) {
                        dialog.remove();
                        if(result && result.app){
                            var table = "<table class='events-table d-table' cellpadding='0' cellspacing='0'>";
                            table += "<colgroup><col width='200px'><col width='155px'><col width='100%'></colgroup>";
                            //app creator
                            table += "<tr><th colspan='3'>"+jQuery.i18n.map["management-applications.app-details"]+"</th></tr>";
                            table += "<tr><td>"+jQuery.i18n.map["management-applications.app-creator"]+"</td><td class='details-value' colspan='2'>"+((result.app.owner == "") ? jQuery.i18n.map["common.unknown"] : "<a href='#/manage/users/"+result.app.owner_id+"' class='table-link-user green'>"+result.app.owner+"</a>") +"</td></tr>";
                            table += "<tr><td>"+jQuery.i18n.map["management-applications.app-created-at"]+"</td><td class='details-value' colspan='2'>"+((result.app.created_at == 0)? jQuery.i18n.map["common.unknown"] : countlyCommon.formatTimeAgo(result.app.created_at))+"</td></tr>";
                            table += "<tr><td>"+jQuery.i18n.map["management-applications.app-edited-at"]+"</td><td class='details-value' colspan='2'>"+((result.app.edited_at == 0)? jQuery.i18n.map["common.unknown"] : countlyCommon.formatTimeAgo(result.app.edited_at))+"</td></tr>";
                            table += "<tr><td>"+jQuery.i18n.map["management-applications.app-last-data"]+"</td><td class='details-value' colspan='2'>"+((result.app.last_data == 0)? jQuery.i18n.map["common.unknown"] : countlyCommon.formatTimeAgo(result.app.last_data))+"</td></tr>";
                            table += "<tr><td rowspan='3'>"+jQuery.i18n.map["management-applications.app-users"]+"</td>";
                            table += "<td class='second-header'>"+jQuery.i18n.map["management-applications.global_admins"]+"</td><td class='details-value'>"+joinUsers(result.global_admin)+"</td></tr>";
                            table += "<tr><td class='second-header'>"+jQuery.i18n.map["management-applications.admins"]+"</td><td class='details-value'>"+joinUsers(result.admin)+"</td></tr>";
                            table += "<tr><td class='second-header'>"+jQuery.i18n.map["management-applications.users"]+"</td><td class='details-value'>"+joinUsers(result.user)+"</td></tr>";
                            CountlyHelpers.popup(table+"</table><div class='buttons'><div class='icon-button light btn-close'>"+jQuery.i18n.map["common.close"]+"</div></div>", "app_details_table", true);
                            $(".btn-close").off("click").on("click", function(){$("#overlay").trigger('click');});
                        }
                        else{
                            CountlyHelpers.alert(jQuery.i18n.map["management-applications.application-no-details"], "red");
                        }
                    },
                    error: function(){
                        dialog.remove();
                        CountlyHelpers.alert(jQuery.i18n.map["management-applications.application-no-details"], "red");
                    }
                });
            });
            app.localize($("#content"));
        }

        function initCountrySelect(parent, countryCode, timezoneText, timezone) {
            $(parent + " #timezone-select").hide();
            $(parent + " #selected").hide();
            $(parent + " #timezone-items").html("");
            $(parent + " #country-items").html("");

            var countrySelect = $(parent + " #country-items");
            var timezoneSelect = $(parent + " #timezone-items");

            for (var key in timezones) {
                countrySelect.append("<div data-value='" + key + "' class='item'><div class='flag' style='background-image:url("+countlyGlobal["cdn"]+"images/flags/" + key.toLowerCase() + ".png)'></div>" + timezones[key].n + "</div>")
            }

            if (countryCode && timezoneText && timezone) {
                var country = timezones[countryCode];

                if (country.z.length == 1) {
                    for (var prop in country.z[0]) {
                        $(parent + " #selected").show();
                        $(parent + " #selected").text(prop);
                        $(parent + " #app-timezone").val(country.z[0][prop]);
                        $(parent + " #app-country").val(countryCode);
                        $(parent + " #country-select .text").html("<div class='flag' style='background-image:url("+countlyGlobal["cdn"]+"images/flags/" + countryCode.toLowerCase() + ".png)'></div>" + country.n);
                    }
                } else {
                    $(parent + " #timezone-select").find(".text").text(prop);
                    var countryTimezones = country.z;

                    for (var i = 0; i < countryTimezones.length; i++) {
                        for (var prop in countryTimezones[i]) {
                            timezoneSelect.append("<div data-value='" + countryTimezones[i][prop] + "' class='item'>" + prop + "</div>")
                        }
                    }

                    $(parent + " #app-timezone").val(timezone);
                    $(parent + " #app-country").val(countryCode);
                    $(parent + " #country-select .text").html("<div class='flag' style='background-image:url("+countlyGlobal["cdn"]+"images/flags/" + countryCode.toLowerCase() + ".png)'></div>" + country.n);
                    $(parent + " #timezone-select .text").text(timezoneText);
                    $(parent + " #timezone-select").show();
                }

                $(parent + " .select-items .item").click(function () {
                    var selectedItem = $(this).parents(".cly-select").find(".text");
                    selectedItem.html($(this).html());
                    selectedItem.data("value", $(this).data("value"));
                });
                $(parent + " #timezone-items .item").click(function () {
                    $(parent + " #app-timezone").val($(this).data("value"));
                });
            }

            $(parent + " #country-items .item").click(function () {
                $(parent + " #selected").text("");
                $(parent + " #timezone-select").hide();
                timezoneSelect.html("");
                var attr = $(this).data("value");
                var countryTimezones = timezones[attr].z;

                if (countryTimezones.length == 1) {
                    for (var prop in timezones[attr].z[0]) {
                        $(parent + " #selected").show();
                        $(parent + " #selected").text(prop);
                        $(parent + " #app-timezone").val(timezones[attr].z[0][prop]);
                        $(parent + " #app-country").val(attr);
                    }
                } else {

                    var firstTz = "";

                    for (var i = 0; i < timezones[attr].z.length; i++) {
                        for (var prop in timezones[attr].z[i]) {
                            if (i == 0) {
                                $(parent + " #timezone-select").find(".text").text(prop);
                                firstTz = timezones[attr].z[0][prop];
                                $(parent + " #app-country").val(attr);
                            }

                            timezoneSelect.append("<div data-value='" + timezones[attr].z[i][prop] + "' class='item'>" + prop + "</div>")
                        }
                    }

                    $(parent + " #timezone-select").show();
                    $(parent + " #app-timezone").val(firstTz);
                    $(parent + " .select-items .item").click(function () {
                        var selectedItem = $(this).parents(".cly-select").find(".text");
                        selectedItem.html($(this).html());
                        selectedItem.data("value", $(this).data("value"));
                    });
                    $(parent + " #timezone-items .item").click(function () {
                        $(parent + " #app-timezone").val($(this).data("value"));
                    });
                }
            });
        }

        function hideEdit() {
            $("#edit-app").removeClass("active");
            $(".edit").hide();
            $(".read").show();
            $(".table-edit").hide();
            $(".required").hide();
        }

        function resetAdd() {
            $("#app-add-name").val("");
            $("#app-add-type").text(jQuery.i18n.map["management-applications.type.tip"]);
            $("#app-add-type").data("value", "");
            $("#app-add-category").text(jQuery.i18n.map["management-applications.category.tip"]);
            $("#app-add-category").data("value", "");
            $("#app-add-timezone #selected").text("");
            $("#app-add-timezone #selected").hide();
            $("#app-add-timezone .text").html(jQuery.i18n.map["management-applications.time-zone.tip"]);
            $("#app-add-timezone .text").data("value", "");
            $("#app-add-timezone #app-timezone").val("");
            $("#app-add-timezone #app-country").val("");
            $("#app-add-timezone #timezone-select").hide();
            $(".required").hide();
            if(countlyGlobal["config"] && countlyGlobal["config"].code && $("#code-countly").length){
                $("#code-countly").show();
            }
        }

        function showAdd() {
            if ($("#app-container-new").is(":visible")) {
                return false;
            }
            $(".app-container").removeClass("active");
            $("#first-app-success").hide();
            $("#code-countly").hide();
            hideEdit();
            var manageBarApp = $("#manage-new-app>div").clone();
            manageBarApp.attr("id", "app-container-new");
            manageBarApp.addClass("active");

            if (jQuery.isEmptyObject(countlyGlobal['apps'])) {
                $("#cancel-app-add").hide();
                $("#manage-new-app").hide();
            } else {
                $("#cancel-app-add").show();
            }

            $("#app-management-bar .scrollable").append(manageBarApp);
            $("#add-new-app").show();
            $("#view-app").hide();

            var userTimezone = jstz.determine().name();

            // Set timezone selection defaults to user's current timezone
            for (var countryCode in timezones) {
                for (var i = 0; i < timezones[countryCode].z.length; i++) {
                    for (var countryTimezone in timezones[countryCode].z[i]) {
                        if (timezones[countryCode].z[i][countryTimezone] == userTimezone) {
                            initCountrySelect("#app-add-timezone", countryCode, countryTimezone, userTimezone);
                            break;
                        }
                    }
                }
            }
        }

        function hideAdd() {
            $("#app-container-new").remove();
            $("#add-new-app").hide();
            resetAdd();
            $("#view-app").show();
            if(countlyGlobal["config"] && countlyGlobal["config"].code && $("#code-countly").length){
                $("#code-countly").show();
            }
        }
        
        if(countlyGlobal["config"] && countlyGlobal["config"].code && $("#code-countly").length){
            $("#code-countly").show();
            var url = (location.protocol || "http:")+"//"+location.hostname + (location.port ? ":" + location.port : "") + "/" + countlyGlobal["path"]; 
                
            $.getScript( url+"sdks.js", function( data, textStatus, jqxhr ) {
                var server = (location.protocol || "http:")+"//"+location.hostname + (location.port ? ":" + location.port : "") + "/" + countlyGlobal["path"];
                if(server.substr(server.length - 1) == '/') {
                    server = server.substr(0, server.length - 1);
                }
                if(typeof sdks !== "undefined" && server){
                    function initCountlyCode(appId, type){
                        var app_id = $("#app-edit-id").val();
                        if(appId && appId != "" && countlyGlobal["apps"][appId]){
                            $("#code-countly .sdks").empty();
                            for(var i in sdks){
                                if(sdks[i].integration)
                                    $("#code-countly .sdks").append("<a href='http://code.count.ly/integration-"+i+".html?server="+server+"&app_key="+countlyGlobal["apps"][appId].key+"' target='_blank'>"+sdks[i].name.replace("SDK", "")+"</a>");
                            }
                        }
                    }
                    initCountlyCode($("#app-edit-id").val());
                    app.addAppManagementSwitchCallback(initCountlyCode);
                }
            });
        }
        
        initAppManagement(appId);
        initCountrySelect("#app-add-timezone");

        $("#clear-app-data").click(function () {
            if ($(this).hasClass("active")){
                $(this).removeClass("active");
                $(".options").hide();
            }
            else{
                $(this).addClass("active");
                $(".options").show();
            }
        });
        
        $("#clear-data.options li").click(function(){
            $("#clear-app-data").removeClass('active');
            $(".options").hide();
            var period = $(this).attr("id").replace("clear-", "");
            
            var helper_msg =jQuery.i18n.map["management-applications.clear-confirm-"+period] || jQuery.i18n.map["management-applications.clear-confirm-period"];
            var helper_title = jQuery.i18n.map["management-applications.clear-"+period+"-data"] || jQuery.i18n.map["management-applications.clear-all-data"];
            var image = "clear-"+period;
            
            if(period=="reset")
                image = "reset-the-app";
            if(period=="all")
                image = "clear-all-app-data";
            CountlyHelpers.confirm(helper_msg, "popStyleGreen", function (result) {
                if (!result) {
                    return true;
                }

                var appId = $("#app-edit-id").val();

                $.ajax({
                    type:"GET",
                    url:countlyCommon.API_PARTS.apps.w + '/reset',
                    data:{
                        args:JSON.stringify({
                            app_id:appId,
                            period:period
                        }),
                        api_key:countlyGlobal['member'].api_key
                    },
                    dataType:"jsonp",
                    success:function (result) {

                        if (!result) {
                            CountlyHelpers.alert(jQuery.i18n.map["management-applications.clear-admin"], "red");
                            return false;
                        } else {
                            $(document).trigger("/i/apps/reset", { app_id: appId, period: period });

                            if(period == "all" || period=="reset"){
                                countlySession.reset();
                                countlyLocation.reset();
                                countlyCity.reset();
                                countlyDevice.reset();
                                countlyCarrier.reset();
                                countlyDeviceDetails.reset();
                                countlyAppVersion.reset();
                                countlyEvent.reset();
                            }
                            if(period=="reset")
                            {
                               CountlyHelpers.alert(jQuery.i18n.map["management-applications.reset-success"], "black");
                            }
                            else
                                CountlyHelpers.alert(jQuery.i18n.map["management-applications.clear-success"], "black");
                        }
                    }
                });
            },[jQuery.i18n.map["common.no-clear"],jQuery.i18n.map["management-applications.yes-clear-app"]],{title:helper_title+"?",image:image});
        });

        $("#delete-app").click(function () {
            CountlyHelpers.confirm(jQuery.i18n.map["management-applications.delete-confirm"], "popStyleGreen", function (result) {

                if (!result) {
                    return true;
                }

                var appId = $("#app-edit-id").val();

                $.ajax({
                    type:"GET",
                    url:countlyCommon.API_PARTS.apps.w + '/delete',
                    data:{
                        args:JSON.stringify({
                            app_id:appId
                        }),
                        api_key:countlyGlobal['member'].api_key
                    },
                    dataType:"jsonp",
                    success:function () {
                        $(document).trigger("/i/apps/delete", { app_id: appId });

                        delete countlyGlobal['apps'][appId];
                        delete countlyGlobal['admin_apps'][appId];
                        var index = Backbone.history.appIds.indexOf(appId+"");
                        if (index > -1) {
                            Backbone.history.appIds.splice(index, 1);
                        }
                        var activeApp = $(".app-container").filter(function () {
                            return $(this).data("id") && $(this).data("id") == appId;
                        });
                        
                        var changeApp = (activeApp.prev().length) ? activeApp.prev() : activeApp.next();
                        initAppManagement(changeApp.data("id"));
                        activeApp.fadeOut("slow").remove();

                        if (_.isEmpty(countlyGlobal['apps'])) {
                            $("#new-install-overlay").show();
                            $("#active-app-icon").css("background-image", "");
                            $("#active-app-name").text("");
                        }
                        else if(countlyCommon.ACTIVE_APP_ID == appId){
                            countlyCommon.setActiveApp(changeApp.data("id"));
                            $("#active-app-icon").css("background-image", "url(appimages/"+changeApp.data("id")+".png)");
                            $("#active-app-name").text(countlyGlobal['apps'][changeApp.data("id")].name);
                        }
                    },
                    error:function () {
                        CountlyHelpers.alert(jQuery.i18n.map["management-applications.delete-admin"], "red");
                    }
                });
            },[jQuery.i18n.map["common.no-dont-delete"],jQuery.i18n.map["management-applications.yes-delete-app"]],{title:jQuery.i18n.map["management-applications.delete-an-app"]+"?",image:"delete-an-app"});
        });

        $("#edit-app").click(function () {
            if ($(".table-edit").is(":visible")) {
                hideEdit();
            } else {
                $(".edit").show();
                $("#edit-app").addClass("active");
                $(".read").hide();
                $(".table-edit").show();
            }
        });

        $("#save-app-edit").click(function () {
            if ($(this).hasClass("disabled")) {
                return false;
            }

            var appId = $("#app-edit-id").val(),
                appName = $("#app-edit-name .edit input").val(),
                current_app_key = $('#app_key_hidden').val(),
                app_key = $("#app-edit-key .edit input").val();

            $(".required").fadeOut().remove();
            var reqSpan = $("<span>").addClass("required").text("*");

            if (!appName) {
                $("#app-edit-name .edit input").after(reqSpan.clone());
            }
            
            if (!app_key) {
                $("#app-edit-key .edit input").after(reqSpan.clone());
            }

            if ($(".required").length) {
                $(".required").fadeIn();
                return false;
            }

            var ext = $('#add-edit-image-form').find("#app_edit_image").val().split('.').pop().toLowerCase();
            if (ext && $.inArray(ext, ['gif', 'png', 'jpg', 'jpeg']) == -1) {
                CountlyHelpers.alert(jQuery.i18n.map["management-applications.icon-error"], "red");
                return false;
            }

            $(this).addClass("disabled");

            var args = {
                app_id:appId,
                name:appName,
                type:$("#app-edit-type .cly-select .text").data("value") + '',
                category:$("#app-edit-category .cly-select .text").data("value") + '',
                key:app_key,
                timezone:$("#app-edit-timezone #app-timezone").val(),
                country:$("#app-edit-timezone #app-country").val(),
                checksum_salt:$("#app-edit-salt .edit input").val()
            };
            
            $(".app-details .app-write-settings").each(function(){
                var id = $(this).data('id');
                if(app.appSettings[id] && app.appSettings[id].toSave)
                    app.appSettings[id].toSave(appId, args, this);
                else if(typeof args !== "undefined")
                    args[id] = $(this).val();
            });

            app.appObjectModificators.forEach(function(mode){
                mode(args);
            });

            var updateApp = function(){
                $.ajax({
                    type:"GET",
                    url:countlyCommon.API_PARTS.apps.w + '/update',
                    data:{
                        args:JSON.stringify(args),
                        api_key:countlyGlobal['member'].api_key
                    },
                    dataType:"jsonp",
                    success:function (data) {
                        for (var modAttr in data) {
                            countlyGlobal['apps'][appId][modAttr] = data[modAttr];
                            countlyGlobal['admin_apps'][appId][modAttr] = data[modAttr];
                        }

                        if (!ext) {
                            $("#save-app-edit").removeClass("disabled");
                            initAppManagement(appId);
                            hideEdit();
                            $(".app-container").filter(function () {
                                return $(this).data("id") && $(this).data("id") == appId;
                            }).find(".name").text(appName);

                            var sidebarLogo = $("#active-app-icon").attr("style");
                            if (sidebarLogo.indexOf(appId) !== -1) {
                                $("#active-app-name").text(appName);
                            }
                            return true;
                        }

                        $('#add-edit-image-form').find("#app_edit_image_id").val(appId);
                        $('#add-edit-image-form').ajaxSubmit({
                            resetForm:true,
                            beforeSubmit:function (formData, jqForm, options) {
                                formData.push({ name:'_csrf', value:countlyGlobal['csrf_token'] });
                            },
                            success:function (file) {
                                $("#save-app-edit").removeClass("disabled");
                                var updatedApp = $(".app-container").filter(function () {
                                    return $(this).data("id") && $(this).data("id") == appId;
                                });

                                if (!file) {
                                    CountlyHelpers.alert(jQuery.i18n.map["management-applications.icon-error"], "red");
                                } else {
                                    updatedApp.find(".logo").css({
                                        "background-image":"url(" + file + "?v" + (new Date().getTime()) + ")"
                                    });
                                    $("#active-app-icon").css("background-image", $("#active-app-icon").css("background-image").replace(")","") + "?v" + (new Date().getTime()) + ")");
                                }

                                initAppManagement(appId);
                                hideEdit();
                                updatedApp.find(".name").text(appName);
                                $("#app-edit-image").find(".logo").css({
                                    "background-image":"url(" + file + "?v" + (new Date().getTime()) + ")"
                                });
                            },
                            error: function(xhr, status, error){
                                CountlyHelpers.alert(error, "red");
                                initAppManagement(appId);
                                hideEdit();
                            }
                        });
                    }
                });
            }

            if (current_app_key !== app_key) {
                var warningText = jQuery.i18n.map["management-applications.app-key-change-warning"];
                if(countlyGlobal["plugins"].indexOf("drill") > -1){
                    warningText = jQuery.i18n.map["management-applications.app-key-change-warning-EE"];
                }
                CountlyHelpers.confirm(warningText, "popStyleGreen popStyleGreenWide", function (result) {
                    if(result)
                        updateApp();
                    else
                        $("#save-app-edit").removeClass("disabled");
                },[jQuery.i18n.map["common.no-dont-change"],jQuery.i18n.map["management-applications.app-key-change-warning-confirm"]],{title:jQuery.i18n.map["management-applications.app-key-change-warning-title"],image:"change-the-app-key"});
            }else 
                updateApp();

            
        });

        $("#cancel-app-edit").click(function () {
            hideEdit();
            var appId = $("#app-edit-id").val();
            initAppManagement(appId);
        });

        $("#management-app-container .app-container:not(#app-container-new)").live("click", function () {
            var appId = $(this).data("id");
            hideEdit();
            $(".app-container").removeClass("active");
            $(this).addClass("active");
            initAppManagement(appId);
        });

        $("#add-app-button").click(function () {
            showAdd();
        });

        $("#cancel-app-add").click(function () {
            $("#app-container-new").remove();
            $("#add-new-app").hide();
            $("#view-app").show();
            $(".new-app-name").text(jQuery.i18n.map["management-applications.my-new-app"]);
            resetAdd();
        });

        $("#app-add-name").keyup(function () {
            var newAppName = $(this).val();
            $("#app-container-new .name").text(newAppName);
            $(".new-app-name").text(newAppName);
        });

        $("#save-app-add").click(function () {

            if ($(this).hasClass("disabled")) {
                return false;
            }

            var appName = $("#app-add-name").val(),
                type = $("#app-add-type").data("value") + "",
                category = $("#app-add-category").data("value") + "",
                timezone = $("#app-add-timezone #app-timezone").val(),
                country = $("#app-add-timezone #app-country").val();

            $(".required").fadeOut().remove();
            var reqSpan = $("<span>").addClass("required").text("*");

            if (!appName) {
                $("#app-add-name").after(reqSpan.clone());
            }
            
            if (!type) {
                $("#app-add-type").parents(".cly-select").after(reqSpan.clone());
            }

            /*if (!category) {
                $("#app-add-category").parents(".cly-select").after(reqSpan.clone());
            }*/

            if (!timezone) {
                $("#app-add-timezone #app-timezone").after(reqSpan.clone());
            }

            if ($(".required").length) {
                $(".required").fadeIn();
                return false;
            }

            var ext = $('#add-app-image-form').find("#app_add_image").val().split('.').pop().toLowerCase();
            if (ext && $.inArray(ext, ['gif', 'png', 'jpg', 'jpeg']) == -1) {
                CountlyHelpers.alert(jQuery.i18n.map["management-applications.icon-error"], "red");
                return false;
            }

            $(this).addClass("disabled");

            var args = {
                name:appName,
                type:type,
                category:category,
                timezone:timezone,
                country:country
            };
            
            $("#add-new-app .app-write-settings").each(function(){
                var id = $(this).data('id');
                if(app.appSettings[id] && app.appSettings[id].toSave)
                    app.appSettings[id].toSave(null, args, this);
                else if(typeof args !== "undefined")
                    args[id] = $(this).val();
            });

            app.appObjectModificators.forEach(function(mode){
                mode(args);
            });

            $.ajax({
                type:"GET",
                url:countlyCommon.API_PARTS.apps.w + '/create',
                data:{
                    args:JSON.stringify(args),
                    api_key:countlyGlobal['member'].api_key
                },
                dataType:"jsonp",
                success:function (data) {

                    var sidebarApp = $("#sidebar-new-app>div").clone();

                    countlyGlobal['apps'][data._id] = data;
                    countlyGlobal['admin_apps'][data._id] = data;
                    Backbone.history.appIds.push(data._id+"");

                    var newApp = $("#app-container-new");
                    newApp.data("id", data._id);
                    newApp.data("key", data.key);
                    newApp.find(".name").data("localize", "");
                    newApp.find(".name").text(data.name);
                    newApp.removeAttr("id");

                    if (!ext) {
                        $("#save-app-add").removeClass("disabled");
                        sidebarApp.find(".name").text(data.name);
                        sidebarApp.data("id", data._id);
                        sidebarApp.data("key", data.key);
                        newApp.find(".logo").css({
                            "background-image":"url(appimages/" + data._id + ".png)"
                        });

                        $("#app-nav .apps-scrollable").append(sidebarApp);
                        initAppManagement(data._id);
                        return true;
                    }

                    $('#add-app-image-form').find("#app_add_image_id").val(data._id);
                    $('#add-app-image-form').ajaxSubmit({
                        resetForm:true,
                        beforeSubmit:function (formData, jqForm, options) {
                            formData.push({ name:'_csrf', value:countlyGlobal['csrf_token'] });
                        },
                        success:function (file) {
                            $("#save-app-add").removeClass("disabled");

                            if (!file) {
                                CountlyHelpers.alert(jQuery.i18n.map["management-applications.icon-error"], "red");
                            } else {
                                newApp.find(".logo").css({
                                    "background-image":"url(" + file + ")"
                                });
                                sidebarApp.find(".logo").css({
                                    "background-image":"url(" + file + ")"
                                });
                            }

                            sidebarApp.find(".name").text(data.name);
                            sidebarApp.data("id", data._id);
                            sidebarApp.data("key", data.key);

                            $("#app-nav .apps-scrollable").append(sidebarApp);
                            initAppManagement(data._id);
                        }
                    });
                }
            });
        });
        
    }
});

window.ManageUsersView = countlyView.extend({
    /*
        Listen for;
            user-mgmt.user-created : On new user created. Param : new user form model.
            user-mgmt.user-updated : On user updated. Param: user form model.
            user-mgmt.user-deleted : On user deleted. Param: userid
            user-mgmt.user-selected : On user selected. Param : user.
            user-mgmt.new-user-button-clicked : On new user button clicked.

            Ex:
                $(app.manageUsersView).on('user-mgmt.user-selected', function(e, user) { console.log(user) });

        Triggers for;
            user-mgmt.render: To render usertable from outside.
            
            Ex: 
                $(app.manageUsersView).trigger('user-mgmt.render');
    */
    template:null,
    initialize:function () {
        var self = this;
        T.render('templates/users', function (t) {
            self.template = t;
        });
    },
    beforeRender: function() {
		if(this.template)
			return true;
		else{
			var self = this;
			return $.when($.get(countlyGlobal["path"]+'/templates/users.html', function(src){
				self.template = Handlebars.compile(src);
			})).then(function () {});
		}
    },
    renderTable: function(users){
        var self = this;
        $('#content').html(self.template({
            "page-title":jQuery.i18n.map["sidebar.management.users"],
            users:users,
            apps:countlyGlobal['apps'],
            is_global_admin: (countlyGlobal["member"].global_admin) ? true : false
        }));
        var tableData = [];
        if(users){
            for(var i in users){
                tableData.push(users[i])
            }
        }
        self.dtable = $('#user-table').dataTable($.extend({}, $.fn.dataTable.defaults, {
            "aaData": tableData,
            "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
                $(nRow).attr("id", aData._id);
            },
            "aoColumns": [
                CountlyHelpers.expandRowIconColumn(),
                { "mData": function(row, type){
                    if(type == "display")
                        return "<span title='"+row.full_name+"'>"+row.full_name+"</span>"; 
                    else 
                        return row.full_name;
            }, "sType":"string", "sExport":"userinfo", "sTitle": jQuery.i18n.map["management-users.full-name"], "sClass":"trim"},
                { "mData": function(row, type){if(type == "display") return "<span title='"+row.username+"'>"+row.username+"</span>"; else return row.username;}, "sType":"string", "sTitle": jQuery.i18n.map["management-users.username"], "sClass":"trim"},
                { "mData": function(row, type){if(row.global_admin) return jQuery.i18n.map["management-users.global-admin"]; else if(row.admin_of && row.admin_of.length) return jQuery.i18n.map["management-users.admin"]; else if(row.user_of && row.user_of.length)  return jQuery.i18n.map["management-users.user"]; else return jQuery.i18n.map["management-users.no-role"]}, "sType":"string", "sTitle": jQuery.i18n.map["management-users.role"]},
                { "mData": function(row, type){if(type == "display") return "<span title='"+row.email+"'>"+row.email+"</span>"; else return row.email;}, "sType":"string", "sTitle": jQuery.i18n.map["management-users.email"], "sClass":"trim"},
                { "mData": function(row, type){if(type == "display") return (row["created_at"]) ? countlyCommon.formatTimeAgo(row["created_at"]) : ""; else return (row["created_at"]) ? row["created_at"] : 0;}, "sType":"format-ago", "sTitle": jQuery.i18n.map["management-users.created"]},
                { "mData": function(row, type){if(type == "display") return (row["last_login"]) ? countlyCommon.formatTimeAgo(row["last_login"]) : jQuery.i18n.map["common.never"]; else return (row["last_login"]) ? row["last_login"] : 0;}, "sType":"format-ago", "sTitle": jQuery.i18n.map["management-users.last_login"]}
            ]
        }));
        self.dtable.fnSort( [ [0,'asc'] ] );
        self.dtable.stickyTableHeaders();
        CountlyHelpers.expandRows(self.dtable, self.editUser, self);
        app.addDataExport("userinfo", function(){
            var ret = [];
            var elem;
            for(var i = 0; i < tableData.length; i++){
                elem = {};
                elem[jQuery.i18n.map["management-users.full-name"]] = tableData[i].full_name;
                elem[jQuery.i18n.map["management-users.username"]] = tableData[i].username;
                elem[jQuery.i18n.map["management-users.email"]] = tableData[i].email;
                elem[jQuery.i18n.map["management-users.global-admin"]] = tableData[i].global_admin;
                elem[jQuery.i18n.map["management-users.lock-account"]] = tableData[i].locked;
                
                if(tableData[i].created_at == 0)
                    elem[jQuery.i18n.map["management-users.created"]] = jQuery.i18n.map["common.unknown"];
                else
                    elem[jQuery.i18n.map["management-users.created"]] = moment(parseInt(tableData[i].created_at)*1000).format("ddd, D MMM YYYY HH:mm:ss");
                
                if(tableData[i].last_login == 0)
                    elem[jQuery.i18n.map["management-users.last_login"]] = jQuery.i18n.map["common.unknown"];
                else
                    elem[jQuery.i18n.map["management-users.last_login"]] = moment(parseInt(tableData[i].last_login)*1000).format("ddd, D MMM YYYY HH:mm:ss");

                if(tableData[i].admin_of && tableData[i].admin_of.length)
                    elem[jQuery.i18n.map["management-users.admin-of"]] = CountlyHelpers.appIdsToNames(tableData[i].admin_of);
                else
                    elem[jQuery.i18n.map["management-users.admin-of"]] = "";
                
                if(tableData[i].user_of && tableData[i].user_of.length)
                    elem[jQuery.i18n.map["management-users.user-of"]] = CountlyHelpers.appIdsToNames(tableData[i].user_of);
                else
                    elem[jQuery.i18n.map["management-users.user-of"]] = "";
                
                if(typeof pathsToSectionNames !== "undefined"){
                    var allUrls = getUrls();
                    if(tableData[i].restrict && tableData[i].restrict.length){
                        var allowed = [];
                        for(var j = 0; j < allUrls.length; j++){
                            if(tableData[i].restrict.indexOf(allUrls[j]) === -1){
                                allowed.push(allUrls[j]);
                            }
                        }
                        elem[jQuery.i18n.map["restrict.restricted-sections"]] = pathsToSectionNames(tableData[i].restrict);
                        elem[jQuery.i18n.map["restrict.sections-allowed"]] = pathsToSectionNames(allowed);
                    }
                    else{
                        elem[jQuery.i18n.map["restrict.restricted-sections"]] = "";
                        elem[jQuery.i18n.map["restrict.sections-allowed"]] = pathsToSectionNames(allUrls);
                    }
                }
                
                ret.push(elem);
            }
            return ret;
        });
        if(self._id){
            $(self.el).prepend('<a class="back back-link"><span>'+jQuery.i18n.map["common.back"]+'</span></a>');
            $(self.el).find(".back").click(function(){
               app.back("/manage/users");
            });
        }
        self.initTable();
        $("#add-user-mgmt").on("click", function(){
            CountlyHelpers.closeRows(self.dtable);
            $("#listof-apps").hide();
            $(".row").removeClass("selected");
            app.onUserEdit({}, $(".create-user-row"));
            $(".create-user-row").slideDown();
            self.initTable();
            $(this).hide();

            $(self).trigger('user-mgmt.new-user-button-clicked');
        });
        $("#listof-apps .app").on('click', function() {
            if ($(this).hasClass("disabled")) {
                return true;
            }
            
            $(this).toggleClass("selected");

            self.setSelectDeselect();
            
            adminsOf = [];
            var adminOfIds = [];
            $("#listof-apps .app.selected").each(function() {
                adminsOf[adminsOf.length] = $(this).find(".name").text();
                adminOfIds[adminOfIds.length] = $(this).find(".app_id").val();
            });
            
            activeRow = $(".row.selected");
            
            if ($("#listof-apps .app.selected").length == 0) {
                activeRow.find(".no-apps").show();
            } else {
                activeRow.find(".no-apps").hide();
            }
            
            activeRow.find(".user-admin-list").text(adminsOf.join(", "));
            activeRow.find(".app-list").val(adminOfIds.join(","));
            
            var userAppRow = activeRow.next(".user-apps");
            
            if (userAppRow.length) {
                var userAppIds = userAppRow.find(".app-list").val(),
                    usersOfIds = (userAppIds)? userAppIds.split(",") : [];
            
                for (var i = 0; i < adminOfIds.length; i++) {
                    if (usersOfIds.indexOf(adminOfIds[i]) == -1) {
                        if (usersOfIds.length == 0 && i == 0) {
                            userAppRow.find(".user-admin-list").text(adminsOf[i]);
                            userAppRow.find(".app-list").val(adminOfIds[i]);
                        } else {
                            userAppRow.find(".user-admin-list").text(userAppRow.find(".user-admin-list").text().trim() + ", " + adminsOf[i]);
                            userAppRow.find(".app-list").val(userAppRow.find(".app-list").val() + "," + adminOfIds[i]);
                        }
                        
                        userAppRow.find(".no-apps").hide();
                    }
                }
            }
        });
        $(".cancel-user-row").on("click", function() {
            $("#listof-apps").hide();
            $(".row").removeClass("selected");
            $(".create-user-row").slideUp();
             $('#add-user-mgmt').show();
        });
        $(".create-user").on("click", function() {		
            $("#listof-apps").hide();
            $(".row").removeClass("selected");
            $(".email-check.green-text").remove();
            $(".username-check.green-text").remove();
            
            var data = {},
                currUserDetails = $(".user-details:visible");
            
            data.full_name = currUserDetails.find(".full-name-text").val();
            data.username = currUserDetails.find(".username-text").val();
            data.email = currUserDetails.find(".email-text").val();
            data.global_admin = currUserDetails.find(".global-admin").hasClass("checked");
            data.password = currUserDetails.find(".password-text").val();
            
            $(".required").fadeOut().remove();
            var reqSpan = $("<span>").addClass("required").text("*");
            
            if (!data.password.length) {
                currUserDetails.find(".password-text").after(reqSpan.clone());
            } else {
                $(".password-check").remove();
                var error = CountlyHelpers.validatePassword(data.password);
                if(error){
                    var invalidSpan = $("<span class='password-check red-text'>").html(error);
                    currUserDetails.find(".password-text").after(invalidSpan.clone());
                }
            }
            
            if (!data.full_name.length) {
                currUserDetails.find(".full-name-text").after(reqSpan.clone());
            }
            
            if (!data.username.length) {
                currUserDetails.find(".username-text").after(reqSpan.clone());
            }
            
            if (!data.email.length) {
                currUserDetails.find(".email-text").after(reqSpan.clone());
            } else if (!CountlyHelpers.validateEmail(data.email)) {
                $(".email-check").remove();
                var invalidSpan = $("<span class='email-check red-text'>").html(jQuery.i18n.map["management-users.email.invalid"]);
                currUserDetails.find(".email-text").after(invalidSpan.clone());
            }
            
            if ($(".required").length) {
                $(".required").fadeIn();
                return false;
            } else if ($(".red-text").length) {
                return false;
            }
            
            if (!data.global_admin) {
                data.admin_of = currUserDetails.find(".admin-apps .app-list").val().split(",");
                data.user_of = currUserDetails.find(".user-apps .app-list").val().split(",");
            }

            app.onUserEdit(data, false);

            $.ajax({
                type: "GET",
                url: countlyCommon.API_PARTS.users.w + '/create',
                data: {
                    args: JSON.stringify(data),
                    api_key: countlyGlobal['member'].api_key
                },
                dataType: "jsonp",
                success: function() {
                    $(self).trigger('user-mgmt.user-created', data);
                    app.activeView.render();
                }
            });
        });
        $('.scrollable').slimScroll({
            height: '100%',
            start: 'top',
            wheelStep: 10,
            position: 'right',
            disableFadeOut:false
        });
        $("#select-all").on('click', function() {
            $("#listof-apps .app:not(.disabled)").addClass("selected");
            adminsOf = [];
            var adminOfIds = [];
            
            $("#listof-apps .app.selected").each(function() {
                adminsOf[adminsOf.length] = $(this).find(".name").text();
                adminOfIds[adminOfIds.length] = $(this).find(".app_id").val();
            });
        
            activeRow = $(".row.selected");
            
            activeRow.find(".user-admin-list").text(adminsOf.join(", "));
            activeRow.find(".app-list").val(adminOfIds.join(","));
            activeRow.find(".no-apps").hide();
		
            var userAppRow = activeRow.next(".user-apps");
            
            if (userAppRow.length) {
                userAppRow.find(".user-admin-list").text(adminsOf.join(", "));
                userAppRow.find(".app-list").val(adminOfIds.join(","));
                userAppRow.find(".no-apps").hide();
            }
            
            $(this).hide();
            $("#deselect-all").show();
        });
        
        $("#deselect-all").on('click', function() {
            $("#listof-apps").find(".app:not(.disabled)").removeClass("selected");
            
            adminsOf = [];
            var adminOfIds = [];
            
            $("#listof-apps .app.selected").each(function() {
                adminsOf[adminsOf.length] = $(this).find(".name").text();
                adminOfIds[adminOfIds.length] = $(this).find(".app_id").val();
            });
            
            activeRow = $(".row.selected");
            
            activeRow.find(".user-admin-list").text(adminsOf.join(", "));
            activeRow.find(".app-list").val(adminOfIds.join(","));
            
            if ($("#listof-apps .app.selected").length == 0) {
                activeRow.find(".no-apps").show();
            } else {
                activeRow.find(".no-apps").hide();
            }
            
            $(this).hide();
            $("#select-all").show();
        });
        
        $("#done").on('click', function() {
            $("#listof-apps").hide();
            $(".row").removeClass("selected");
        });	
    },
    renderCommon:function (isRefresh) {
        var url = countlyCommon.API_PARTS.users.r + '/all';
        var data = {
            api_key:countlyGlobal['member'].api_key
        };
        if(this._id){
            url = countlyCommon.API_PARTS.users.r + '/id';
            data.id = this._id;
        }
        var self = this;
        $.ajax({
            url:url,
            data:data,
            dataType:"jsonp",
            success:function (users) {
                self.renderTable(users);
            },
            error:function () {
                self.renderTable();
            }
        });
        $(this).off('user-mgmt.render').on('user-mgmt.render', function(){ app.activeView.render(); });
    },
    setSelectDeselect: function() {
        var searchInput = $("#listof-apps").find(".search input").val();

        if (searchInput == "") {
            if ($("#listof-apps .app:not(.disabled)").length == 0) {
                $("#select-all").hide();
                $("#deselect-all").hide();
            } else if ($("#listof-apps .app.selected").length == $("#listof-apps .app").length) {
                $("#select-all").hide();
                $("#deselect-all").show();
            } else {
                $("#select-all").show();
                $("#deselect-all").hide();
            }
        } else {
            $("#select-all").hide();
            $("#deselect-all").hide();
        }
    },
    initTable: function(userData){ 
        userData = userData || {};
        var self = this;
        var adminsOf = [],
		activeRow,
		userDetailsClone,
		previousUserDetails,
		lastUserSaved = false,
		previousSelectAppPos = {},
		currUsername = userData.username || "",
		currEmail = userData.email || "";
        // translate help module
        $("[data-help-localize]").each(function() {
            var elem = $(this);
            if (elem.data("help-localize") != undefined) {
                elem.data("help", jQuery.i18n.map[elem.data("help-localize")]);
            }
        });
        
        // translate dashboard
        $("[data-localize]").each(function() {
            var elem = $(this);
            elem.text(jQuery.i18n.map[elem.data("localize")]);				
        });
        
        if ($("#help-toggle").hasClass("active")) {
            $('.help-zone-vb').tipsy({gravity: $.fn.tipsy.autoNS, trigger: 'manual', title: function(){ return ($(this).data("help"))? $(this).data("help") : ""; }, fade: true, offset: 5, cssClass: 'yellow', opacity: 1, html: true});
            $('.help-zone-vs').tipsy({gravity: $.fn.tipsy.autoNS, trigger: 'manual', title: function(){ return ($(this).data("help"))? $(this).data("help") : ""; }, fade: true, offset: 5, cssClass: 'yellow narrow', opacity: 1, html: true});
            
            $.idleTimer('destroy');
            clearInterval(self.refreshActiveView);
            $(".help-zone-vs, .help-zone-vb").hover(
                function () {
                    $(this).tipsy("show");
                }, 
                function () {
                    $(this).tipsy("hide");
                }
            );
        }
        
        function closeActiveEdit() {
            CountlyHelpers.closeRows(self.dtable);
            $("#listof-apps").hide();
            $(".row").removeClass("selected");
        }
        
        $(".select-apps").off("click").on('click', function() {
            $("#listof-apps .app").removeClass("selected");
            activeRow = $(this).parent(".row");
            activeRow.addClass("selected");
            var buttonPos = $(this).offset();
            buttonPos.top = Math.floor(buttonPos.top) + 25;
            buttonPos.left = Math.floor(buttonPos.left) - 18;
            
            if ($("#listof-apps").is(":visible") && JSON.stringify(buttonPos) === JSON.stringify(previousSelectAppPos)) {
                $("#listof-apps").hide();
                $(".row").removeClass("selected");
                return true;
            }
            
            previousSelectAppPos = buttonPos;
            
            var appList = activeRow.find(".app-list").val().split(","),
                adminAppList = $(".admin-apps:visible .app-list").val().split(","),
                isAdminApps = activeRow.hasClass("admin-apps");
            
            $("#listof-apps").find(".app_id").each(function() {
                if (appList.indexOf($(this).val()) != -1) {
                    $(this).parent().addClass("selected");
                }
                
                if (!isAdminApps && adminAppList.indexOf($(this).val()) != -1) {
                    $(this).parent().addClass("disabled");
                } else {
                    $(this).parent().removeClass("disabled");
                }
            });

            self.setSelectDeselect();
            
            $("#listof-apps").show().offset(buttonPos);
            $("#listof-apps").find(".search input").focus();
        });

        $("#listof-apps").find(".search").on('input', 'input', function(e,v) {
            self.setSelectDeselect();
        });

        $(".save-user").off("click").on("click", function() {
            $("#listof-apps").hide();
            $(".row").removeClass("selected");
            $(".email-check.green-text").remove();
            $(".username-check.green-text").remove();
            
            lastUserSaved = true;
            
            var data = {},
                currUserDetails = $(".user-details:visible"),
                changedPassword = false;
            
            data.user_id = $(this).parent(".button-container").find(".user_id").val();
            data.full_name = currUserDetails.find(".full-name-text").val();
            data.username = currUserDetails.find(".username-text").val();
            data.email = currUserDetails.find(".email-text").val();
            
            $(".required").fadeOut().remove();
            var reqSpan = $("<span>").addClass("required").text("*");
            
            if (!data.full_name.length) {
                currUserDetails.find(".full-name-text").after(reqSpan.clone());
            }
            
            if (!data.username.length) {
                currUserDetails.find(".username-text").after(reqSpan.clone());
            }
            
            if (!data.email.length) {
                currUserDetails.find(".email-text").after(reqSpan.clone());
            }
            
            if ($(".required").length) {
                $(".required").fadeIn();
                return false;
            } else if ($(".red-text").length) {
                return false;
            }
            
            if (currUserDetails.find(".delete-user").length != 0) {
                data.global_admin = currUserDetails.find(".global-admin").hasClass("checked");
                data.locked = currUserDetails.find(".lock-account").hasClass("checked");
                
                if (!data.global_admin) {
                    data.admin_of = currUserDetails.find(".admin-apps .app-list").val().split(",");
                    data.user_of = currUserDetails.find(".user-apps .app-list").val().split(",");
                }
            }
            
            if (currUserDetails.find(".password-row").is(":visible") && currUserDetails.find(".password-text").val().length) {
                data.password = currUserDetails.find(".password-text").val();
                changedPassword = true;
            }
            
            if (changedPassword) {
                CountlyHelpers.confirm(jQuery.i18n.prop('management-users.password-change-confirm', data.full_name), "black", function(result) {
                    if (result) {
                        data.send_notification = true;
                    }
                    
                    saveUser();
                }, [jQuery.i18n.map["common.no"], jQuery.i18n.map["common.yes"]]);
            } else {
                saveUser();
            }
            
            function saveUser() {
                app.onUserEdit(data, true);
                $.ajax({
                    type: "GET",
                    url: countlyCommon.API_PARTS.users.w + '/update',
                    data: {
                        args: JSON.stringify(data),
                        api_key: countlyGlobal['member'].api_key
                    },
                    dataType: "jsonp",
                    success: function(result) {
                        if (currUserDetails.find(".delete-user").length == 0) {
                            countlyGlobal["member"].full_name =data.full_name;
                            countlyGlobal["member"].username =data.username;
                            countlyGlobal["member"].email =data.email;

                            $('.menu').find('.user_name').find('div').first().html($("<div>").text(data.full_name).html());
                            $('.menu').find('.user_name').find('div').last().html($("<div>").text(data.email).html());
                            $("#menu-username").text(data.username);
                        }
                        $(self).trigger('user-mgmt.user-updated', data);
                        app.activeView.render();
                    }
                });
            }
        });
        
        $(".username-text").off("keyup").on("keyup",_.throttle(function() {
            if (!($(this).val().length) || currUsername == $(this).val()) {
                $(".username-check").remove();
                return false;
            }
        
            $(this).next(".required").remove();
        
            var existSpan = $("<span class='username-check red-text'>").html(jQuery.i18n.map["management-users.username.exists"]),
                notExistSpan = $("<span class='username-check green-text'>").html("&#10004;"),
                data = {};
            
            data.username = $(this).val();
            data._csrf = countlyGlobal['csrf_token'];
        
            var self = $(this);
            $.ajax({
                type: "POST",
                url: countlyGlobal["path"]+"/users/check/username",
                data: data,
                success: function(result) {
                    $(".username-check").remove();
                    if (result) {
                        self.after(notExistSpan.clone());
                    } else {
                        self.after(existSpan.clone());
                    }
                }
            });
        }, 300));
        
        $(".email-text").off("keyup").on("keyup",_.throttle(function() {
            if (!($(this).val().length) || currEmail == $(this).val()) {
                $(".email-check").remove();
                return false;
            }
            
            $(this).next(".required").remove();
            
            if (!CountlyHelpers.validateEmail($(this).val())) {
                $(".email-check").remove();
                var invalidSpan = $("<span class='email-check red-text'>").html(jQuery.i18n.map["management-users.email.invalid"]);
                $(this).after(invalidSpan.clone());
                return false;
            }
            
            var existSpan = $("<span class='email-check red-text'>").html(jQuery.i18n.map["management-users.email.exists"]),
                notExistSpan = $("<span class='email-check green-text'>").html("&#10004;"),
                data = {};
            
            data.email = $(this).val();
            data._csrf = countlyGlobal['csrf_token'];
            
            var self = $(this);
            $.ajax({
                type: "POST",
                url: countlyGlobal["path"]+"/users/check/email",
                data: data,
                success: function(result) {
                    $(".email-check").remove();
                    if (result) {
                        self.after(notExistSpan.clone());
                    } else {
                        self.after(existSpan.clone());
                    }
                }
            });
        }, 300));
        
        $(".password-text").off("keyup").on("keyup",_.throttle(function() {
            $(".password-check").remove();
            var error = CountlyHelpers.validatePassword($(this).val());
            if (error) {
                var invalidSpan = $("<span class='password-check red-text'>").html(error);
                $(this).after(invalidSpan.clone());
                return false;
            }
        }, 300));
        
        $(".cancel-user").off("click").on("click", function() {
            closeActiveEdit();
        });
        $(".delete-user").off("click").on("click", function() {
            var currUserDetails = $(".user-details:visible");
            var fullName = currUserDetails.find(".full-name-text").val();
        
            var self = $(this);
            CountlyHelpers.confirm(jQuery.i18n.prop('management-users.delete-confirm', fullName), "popStyleGreen", function(result) {
                
                if (!result) {
                    return false;
                }
            
                var data = {
                    user_ids: [self.parent(".button-container").find(".user_id").val()]
                };
                $.ajax({
                    type: "GET",
                    url: countlyCommon.API_PARTS.users.w + '/delete',
                    data: {
                        args: JSON.stringify(data),
                        api_key: countlyGlobal['member'].api_key
                    },
                    dataType: "jsonp",
                    success: function(result) {
                        $(app.manageUsersView).trigger('user-mgmt.user-deleted', data.user_ids);
                        app.activeView.render();
                    }
                });
            },[jQuery.i18n.map["common.no-dont-delete"],jQuery.i18n.map["management-users.yes-delete-user"]],{title:jQuery.i18n.map["management-users.delete-confirm-title"],image:"delete-user"});
        });
        $(".global-admin").off("click").on('click', function() {
            var currUserDetails = $(".user-details:visible");
            
            currUserDetails.find(".user-apps").toggle();
            currUserDetails.find(".admin-apps").toggle();	
            $(this).toggleClass("checked");
            $("#listof-apps").hide();
            $(".row").removeClass("selected");
        });
        $(".remove-time-ban").off("click").on('click', function(){
            var currUserDetails = $(".user-details:visible");
            var url = countlyCommon.API_PARTS.users.r + '/reset_timeban';
            var data = {
                username : currUserDetails.find(".username-text").val()
            }
            $.ajax({
                url:url,
                data:data,
                dataType:"jsonp",
                success:function (res) {
                    CountlyHelpers.notify({
                        title : jQuery.i18n.map["management-users.remove-ban-notify-title"],
                        message: jQuery.i18n.map["management-users.remove-ban-notify-message"]
                    });
                    $('.blocked-user-row').hide();
                }
            });
        });
        $(".lock-account").off("click").on('click', function() {
            var currUserDetails = $(".user-details:visible");	
            $(this).toggleClass("checked");
            $("#listof-apps").hide();
            $(".row").removeClass("selected");
        });
        $(".generate-password").off("click").on('click', function() {
            $(this).parent().find(".password-text").val(CountlyHelpers.generatePassword(countlyGlobal["security"].password_min));
        });
        
        $(".change-password").off("click").on('click', function() {
            $(this).parents(".row").next().toggle();
        });
    },
    editUser: function( d, self ) {
        $(".create-user-row").slideUp();
         $('#add-user-mgmt').show();
        $("#listof-apps").hide();
        $(".row").removeClass("selected");
        CountlyHelpers.closeRows(self.dtable);
		// `d` is the original data object for the row
		var str = '';
		if (d) {
			str += '<div class="user-details datatablesubrow">';

            if (countlyGlobal["member"].global_admin) {
				str += '<div class="row help-zone-vs" data-help-localize="help.manage-users.full-name">';
                    str += '<div class="title" data-localize="management-users.full-name">'+jQuery.i18n.map["management-users.full-name"]+'</div>';
                    str += '<div class="detail"><input class="full-name-text" type="text" value="'+d.full_name+'"/></div>';
                str += '</div>';
				str += '<div class="row help-zone-vs" data-help-localize="help.manage-users.username">';
					str += '<div class="title" data-localize="management-users.username">'+jQuery.i18n.map["management-users.username"]+'</div>';
					str += '<div class="detail">';
					str += '<input class="username-text" type="text" value="'+d.username+'"/><br/>';
						str += '<div class="small-link change-password" data-localize="management-users.change-password">'+jQuery.i18n.map["management-users.change-password"]+'</div>';
					str += '</div>';
				str += '</div>';
				str += '<div class="row password-row">';
					str += '<div class="title" data-localize="management-users.password">'+jQuery.i18n.map["management-users.password"]+'</div>';
					str += '<div class="detail">';
						str += '<input class="password-text" type="text" value=""/><br/>';
						str += '<div class="small-link generate-password" data-localize="management-users.generate-password">'+jQuery.i18n.map["management-users.generate-password"]+'</div>';
					str += '</div>';
				str += '</div>';
				str += '<div class="row help-zone-vs" data-help-localize="help.manage-users.email">';
					str += '<div class="title" data-localize="management-users.email">'+jQuery.i18n.map["management-users.email"]+'</div>';
					str += '<div class="detail"><input class="email-text" type="text" value="'+d.email+'"/></div>';
				str += '</div>';
            }

			if (!d.is_current_user) {
                if (countlyGlobal["member"].global_admin) {
					str += '<div class="row help-zone-vs" data-help-localize="help.manage-users.global-admin">';
                    str += '<div class="title" data-localize="management-users.global-admin">'+jQuery.i18n.map["management-users.global-admin"]+'</div>';
                    str += '<div class="detail">';
                    str += '<div class="option">';

                    if (d.global_admin) {
                        str += '<div class="global-admin checkbox checked"></div>';
                    } else {
                        str += '<div class="global-admin checkbox"></div>';
                    }

                    str += '<div class="text"></div>';
                    str += '</div>';
                    str += '</div>';
                    str += '</div>';

                    // Time ban
                    if(d.blocked){
                        str += '<div class="row blocked-user-row help-zone-vs" data-help-localize="help.management-users.time-banned">';
                        str += '<div class="title" data-localize="management-users.time-banned" style="margin-top:7px">'+jQuery.i18n.map["management-users.time-banned"]+'</div>';
                        str += '<div class="detail">';
                        str += '<div class="option">';

                        str += '<a class="icon-button light remove-time-ban" style="margin-left:0px" data-localize="management-users.remove-ban">'+jQuery.i18n.map["management-users.remove-ban"]+'</a>';

                        str += '<div class="text"></div>';
                        str += '</div>';
                        str += '</div>';
                        str += '</div>';
                    }

                    if (!d.global_admin) {
                        str += '<div class="row help-zone-vs" data-help-localize="help.manage-users.lock-account">';
                        str += '<div class="title" data-localize="management-users.lock-account">'+jQuery.i18n.map["management-users.lock-account"]+'</div>';
                        str += '<div class="detail">';
                        str += '<div class="option">';

                        if (d.locked) {
                            str += '<div class="lock-account checkbox checked"></div>';
                        } else {
                            str += '<div class="lock-account checkbox"></div>';
                        }

                        str += '<div class="text"></div>';
                        str += '</div>';
                        str += '</div>';
                        str += '</div>';
                    }
                }

                if (d.global_admin) {
					str += '<div class="row admin-apps help-zone-vs" data-help-localize="help.manage-users.admin-of" style="display:none;">';
                } else {
					str += '<div class="row admin-apps help-zone-vs" data-help-localize="help.manage-users.admin-of">';
                }

                str += '<div class="title" data-localize="management-users.admin-of">'+jQuery.i18n.map["management-users.admin-of"]+'</div>';
                str += '<div class="select-apps">';
                str += '<i class="fa fa-plus-circle"></i>';
                str += '<input type="hidden" value="'+d.admin_of+'" class="app-list"/>';
                str += '</div>';
                str += '<div class="detail user-admin-list">';

				if (d.admin_of && d.admin_of.length) {
                    str += CountlyHelpers.appIdsToNames(d.admin_of);
				} else {
                    str += '<span data-localize="management-users.admin-of.tip">'+jQuery.i18n.map["management-users.admin-of.tip"]+'</span>';
				}

                str += '</div>';
                str += '<div class="no-apps" data-localize="management-users.admin-of.tip">'+jQuery.i18n.map["management-users.admin-of.tip"]+'</div>';
				str += '</div>';

                if(d.global_admin) {
                    str += '<div class="row user-apps help-zone-vs" data-help-localize="help.manage-users.user-of" style="display:none;">';
                } else {
                    str += '<div class="row user-apps help-zone-vs" data-help-localize="help.manage-users.user-of">';
                }

                str += '<div class="title" data-localize="management-users.user-of">'+jQuery.i18n.map["management-users.user-of"]+'</div>';
                str += '<div class="select-apps">';
                str += '<i class="fa fa-plus-circle"></i>';
                str += '<input type="hidden" value="'+d.user_of+'" class="app-list"/>';
                str += '</div>';
                str += '<div class="detail user-admin-list">';

				if (d.user_of && d.user_of.length) {
                    str += CountlyHelpers.appIdsToNames(d.user_of);
				} else {
                    str += '<span data-localize="management-users.user-of.tip">'+jQuery.i18n.map["management-users.user-of.tip"]+'</span>';
				}

                str += '</div>';
                str += '<div class="no-apps" data-localize="management-users.user-of.tip">'+jQuery.i18n.map["management-users.user-of.tip"]+'</div>';
                str += '</div>';
			}

            str += '<div class="button-container">';
            str += '<input class="user_id" type="hidden" value="'+d._id+'"/>';
            str += '<a class="icon-button light save-user" data-localize="common.save">'+jQuery.i18n.map["common.save"]+'</a>';
            str += '<a class="icon-button light cancel-user" data-localize="common.cancel">'+jQuery.i18n.map["common.cancel"]+'</a>';

            if (!d.is_current_user) {
                str += '<a class="icon-button red delete-user" data-localize="management-users.delete-user">'+jQuery.i18n.map["management-users.delete-user"]+'</a>';
            }

            str += '</div>';
			str += '</div>';
		}

        str = app.onUserEdit(d, str);

        setTimeout(function(){
            self.initTable(d);
            $(self).trigger('user-mgmt.user-selected', d);
        }, 1);
		return str;
	}
});
    
window.EventsBlueprintView = countlyView.extend({
    beforeRender: function() {},
    initialize:function () {
        var previousEvent = countlyCommon.getPersistentSettings()["activeEvent_" + countlyCommon.ACTIVE_APP_ID];
        if(previousEvent)
            countlyEvent.setActiveEvent(previousEvent);
        this.template = Handlebars.compile($("#template-events-blueprint").html()); 
    },
    pageScript:function () {
        var self=this;
        //submenu switch
        $(".event-container").unbind("click");
        $(".event-container").on("click", function () {
            var tmpCurrEvent = $(this).attr("data-key") || "";
            var myitem = this;
            if($("#events-apply-changes").css('display')=="none")
            {
                $(".event-container").removeClass("active");
                $(myitem).addClass("active");
                if(tmpCurrEvent!="")
                {
                    self.selectedSubmenu = tmpCurrEvent;
                    countlyEvent.setActiveEvent(tmpCurrEvent, function() { self.refresh(true,true); });
                }
                else
                {
                    self.selectedSubmenu = "";
                    countlyEvent.setActiveEvent(tmpCurrEvent, function() { self.refresh(true,false); });
                }
            }
            else
            {
                CountlyHelpers.confirm(jQuery.i18n.map["events.general.want-to-discard"], "red",function(result) {
                    if (!result) {return true;}
                    
                    $(".event-container").removeClass("active");
                    $(myitem).addClass("active");
                    if(tmpCurrEvent!="")
                    {
                        self.selectedSubmenu = tmpCurrEvent;
                        countlyEvent.setActiveEvent(tmpCurrEvent, function() { self.refresh(true,true); });
                    }
                    else
                    {
                        self.selectedSubmenu = "";
                        countlyEvent.setActiveEvent(tmpCurrEvent, function() { self.refresh(true,false); });
                    }
                },[jQuery.i18n.map["events.general.cancel"],jQuery.i18n.map['events.general.confirm']]);
            }
        });
        
        //General settings, select all checkbox
        $("#select-all-events").on("click",function(){
            var isChecked = $(this).hasClass("fa-check-square");//is now checked
            if(isChecked)
            {
                $(this).addClass("fa-square-o");
                $(this).removeClass("fa-check-square");
                $(".events-table .select-event-check").addClass("fa-square-o");
                $(".events-table .select-event-check").removeClass("fa-check-square");
            }
            else
            {
                $(this).removeClass("fa-square-o");
                $(this).addClass("fa-check-square");
                $(".events-table .select-event-check").removeClass("fa-square-o");
                $(".events-table .select-event-check").addClass("fa-check-square");
            }
            if($('.select-event-check.fa-check-square').length>0)
                    $('#events-general-action').removeClass('disabled');
                else
                    $('#events-general-action').addClass('disabled');
        });
        
        //General settings drag and drop sorting
        $(".events-table").sortable({
            items:"tbody tr",
            revert:true,
            handle:"td:first-child",
            helper:function (e, elem) {
                elem.children().each(function () {
                    $(this).width($(this).width());
                });
                elem.addClass("moving");
                elem.css("width",(parseInt(elem.width()))+"px");//to not go over line
                return elem;
            },
            cursor:"move",
            containment:"parent",
            tolerance:"pointer",
            placeholder:"event-row-placeholder",
            stop:function (e, elem) {
                elem.item.removeClass("moving");
                $("#events-apply-order").css('display','block');
            }
        });
        
        
        var segments = [];
        for(var i=0; i<self.activeEvent.segments.length; i++)
        {
            segments.push({"key":self.activeEvent.segments[i],"value":self.activeEvent.segments[i]});
        }
        for(var i=0; i<self.activeEvent.omittedSegments.length; i++)
        {
            segments.push({"key":self.activeEvent.omittedSegments[i],"value":self.activeEvent.omittedSegments[i]});
        }
        
        $('#event-management-projection').selectize({
                plugins: ['remove_button'],
				persist: false,
				maxItems: null,
				valueField: 'key',
				labelField: 'key',
				searchField: ['key'],
                delimiter:',',
				options: segments,
                items: self.activeEvent.omittedSegments,
				render: {
					item: function (item, escape) {
						return '<div>' +
							item.key +
							'</div>';
					},
					option: function (item, escape) {
						var label = item.key;
						var caption = item.key;
						return '<div>' +
							'<span class="label">' + label + '</span>' +
							'</div>';
					}
				},
				createFilter: function (input) {
					return true;
				},
				create: function (input) {
					return {
						"key": input
					}
				},
                onChange:function(value)
                {
                    self.check_changes();
                    this.$control_input.css('width', '40px');
                }
        });
            
        //hide apply button
        $("#events-apply-changes").css('display','none');
        self.preventHashChange = false;
        $("#events-apply-order").css('display','none');
        $("#events-general-action").addClass("disabled");
        
        CountlyHelpers.initializeTableOptions($("#events-custom-settings-table"));
            $(".cly-button-menu").on("cly-list.click", function(event, data){
                var id = $(data.target).parents("tr").data("id");
                var name = $(data.target).parents("tr").data("name");
                var visibility = $(data.target).parents("tr").data("visible");
                if(id) {
                    $(".event-settings-menu").find(".delete_single_event").data("id", id);
                    $(".event-settings-menu").find(".delete_single_event").data("name", name);
                    $(".event-settings-menu").find(".event_toggle_visibility").data("id", id);
                    if(visibility==true){
                        $(".event-settings-menu").find(".event_toggle_visibility[data-changeto=hide]").show();
                        $(".event-settings-menu").find(".event_toggle_visibility[data-changeto=show]").hide();
                    }
                    else{
                        $(".event-settings-menu").find(".event_toggle_visibility[data-changeto=hide]").hide();
                        $(".event-settings-menu").find(".event_toggle_visibility[data-changeto=show]").show();
                    }
                }
            });
            
            $(".cly-button-menu").on("cly-list.item", function (event, data) {
                var el = $(data.target);
                var event = el.data("id");
                if(event){
                    if(el.hasClass("delete_single_event")){
                        var eventName=el.data('name');
                        if(eventName=="") eventName = event;                   
                        CountlyHelpers.confirm(jQuery.i18n.prop("events.general.want-delete-this","<b>"+eventName+"</b>"), "popStyleGreen",function(result) {
                            if (!result) {return true;}
                            countlyEvent.delete_events([event],function(result) {
                                if(result==true) {
                                    var msg = {title:jQuery.i18n.map["common.success"], message: jQuery.i18n.map["events.general.events-deleted"],info:"", sticky:false,clearAll:true,type:"ok"};
                                    CountlyHelpers.notify(msg);
                                    self.refresh(true,false);
                                }
                                else
                                    CountlyHelpers.alert(jQuery.i18n.map["events.general.update-not-successful"],"red");
                            });
                        },[jQuery.i18n.map["common.no-dont-delete"],jQuery.i18n.map['events.general.yes-delete-event']],{title:jQuery.i18n.map['events.general.want-delete-this-title'],image:"delete-an-event"});
                    }
                    else if(el.hasClass("event_toggle_visibility")){
                        var toggleto = el.data("changeto");
                        countlyEvent.update_visibility([event],toggleto,function(result){
                            if(result==true){
                                var msg = {title:jQuery.i18n.map["common.success"], message: jQuery.i18n.map["events.general.changes-saved"],info:"", sticky:false,clearAll:true,type:"ok"};
                                CountlyHelpers.notify(msg);
                                self.refresh(true,false);
                            }
                            else
                                CountlyHelpers.alert(jQuery.i18n.map["events.general.update-not-successful"],"red");
                        });
                    }
                }
            });
    },
    renderCommon:function (isRefresh) {
        var eventData = countlyEvent.getEventData();
        var self = this;

        var eventmap = countlyEvent.getEvents(true);
        this.activeEvent="";
        
        for(var i=0; i<eventmap.length; i++)
        {
            if(eventmap[i].is_active==true)
               this.activeEvent = eventmap[i]; 
        }
        
        this.have_drill = false;
        if(countlyGlobal['plugins'] && countlyGlobal['plugins'].indexOf("drill")>-1)
        {
            this.have_drill=true;
        }

        var for_general = countlyEvent.getEventMap(true);
        var keys = Object.keys(for_general);
        var allCount = keys.length;
        var visibleCount = 0;
        var hiddenCount=0;
        for(var i=0; i<keys.length; i++)
        {
            if(for_general[keys[i]].is_visible===false)
                hiddenCount++;
            else
                visibleCount++;
                
            if(for_general[keys[i]].is_visible!=self.visibilityFilter && (self.visibilityFilter===true || self.visibilityFilter===false))
            {
                delete for_general[keys[i]];
            }
        }

        this.templateData = {
            "page-title":eventData.eventName.toUpperCase(),
            "logo-class":"events",
            "events":eventmap,
            "event-map":for_general,
            "submenu":this.selectedSubmenu || "",
            "active-event":this.activeEvent || eventmap[0],
            "visible":jQuery.i18n.map["events.general.status.visible"],
            "hidden":jQuery.i18n.map["events.general.status.hidden"],
            "allCount":allCount,
            "hiddenCount":hiddenCount,
            "visibleCount":visibleCount,
            "have_drill":this.have_drill
        };
        if(hiddenCount==0 && self.visibilityFilter===false)
            this.templateData["onlyMessage"] = jQuery.i18n.map["events.general.no-hidden-events"];
        
        if(visibleCount==0 && self.visibilityFilter===true)
            this.templateData["onlyMessage"] = jQuery.i18n.map["events.general.no-visible-events"];
        
        
        if (countlyEvent.getEvents(true).length == 0) {
            //recheck events
            $.when(countlyEvent.refreshEvents()).then(function () {
                //if still 0, display error
                if (countlyEvent.getEvents().length == 0) {
                    window.location.hash = "/analytics/events";
                }
                else{
                    //reload the view
                    app.renderWhenReady(app.eventsView);
                    self.refresh(true);
                }
            });
            return true;
        }
        
        if (!isRefresh) {
            this.visibilityFilter="";
            this.selectedSubmenu = "";
            $(this.el).html(this.template(this.templateData));
            self.check_changes();
            self.pageScript();
            
            $("#events-event-settings").on("change",".on-off-switch input", function () {
               self.check_changes();
            });

            $("#events-event-settings").on("keyup","input",function () {
                self.check_changes();
            });
            
            $("#events-event-settings").on("keyup","textarea",function () {
                self.check_changes();
            });
            
            //General - checkbooxes in each line:
            $("#events-custom-settings-table").on("click",".select-event-check",function(){
                var isChecked = $(this).hasClass("fa-check-square");//is now checked
                if(isChecked)
                {
                    $(this).addClass("fa-square-o");
                    $(this).removeClass("fa-check-square");
                }
                else
                {
                    $(this).removeClass("fa-square-o");
                    $(this).addClass("fa-check-square");
                }
                
                if($('.select-event-check.fa-check-square').length>0)
                    $('#events-general-action').removeClass('disabled');
                else
                    $('#events-general-action').addClass('disabled');
            });
            
            //General, apply new order
            $("#events-apply-order").on("click", function () {
                var eventOrder = [];
                $("#events-custom-settings .events-table").find(".select-event-check").each(function () {
                    if ($(this).attr("data-event-key")) {
                        eventOrder.push($(this).attr("data-event-key"));
                    }
                });
                countlyEvent.update_map("",JSON.stringify(eventOrder),"","",function(result)
                {
                    if(result==true)
                    {
                        var msg = {title:jQuery.i18n.map["common.success"], message: jQuery.i18n.map["events.general.changes-saved"],info:"", sticky:false,clearAll:true,type:"ok"};
                        CountlyHelpers.notify(msg);
                        self.refresh(true,false);
                    }
                    else
                        CountlyHelpers.alert(jQuery.i18n.map["events.general.update-not-successful"],"red");
                });
            });
            
            $("#events-general-filter").on("cly-select-change", function(e, selected) {
                 if (selected) {
                    if(selected=='hidden')
                        self.visibilityFilter = false;
                    else if(selected=='visible')
                        self.visibilityFilter = true;
                    else
                        self.visibilityFilter="";
                    self.refresh(true);
                }
            });
            //actions change
             $("#events-general-action").on("cly-select-change", function(e, selected) {
                if (selected) {
                   var action = selected;
                   var changeList = [];
                   var nameList=[];
                    $("#events-custom-settings-table").find(".select-event-check").each(function () {
                        if($(this).attr("data-event-key") && $(this).hasClass("fa-check-square")) {
                            changeList.push($(this).attr("data-event-key"));
                            
                            if($(this).attr("data-event-name") && $(this).attr("data-event-name")!="") {
                                nameList.push($(this).attr("data-event-name"));
                            }
                            else
                                nameList.push($(this).attr("data-event-key"));
                        }
                    });
                    
                    if(changeList.length==0)
                         CountlyHelpers.alert(jQuery.i18n.map["events.general.none-chosen"],"red");
                    else
                    {
                        if(selected=="show" || selected=="hide")
                        {
                            countlyEvent.update_visibility(changeList,selected,function(result)
                            {
                                if(result==true)
                                {
                                    var msg = {title:jQuery.i18n.map["common.success"], message: jQuery.i18n.map["events.general.changes-saved"],info:"", sticky:false,clearAll:true,type:"ok"};
                                    CountlyHelpers.notify(msg);
                                    self.refresh(true,false);
                                }
                                else
                                    CountlyHelpers.alert(jQuery.i18n.map["events.general.update-not-successful"],"red");
                            });
                        }
                        else if(selected=="delete")
                        {
                            var title = jQuery.i18n.map["events.general.want-delete-title"];
                            var msg = jQuery.i18n.prop("events.general.want-delete","<b>"+nameList.join(",")+"</b>");
                            var yes_but = jQuery.i18n.map["events.general.yes-delete-events"];
                            if(changeList.length==1)
                            {
                                msg = jQuery.i18n.prop("events.general.want-delete-this","<b>"+nameList.join(",")+"</b>");
                                title = jQuery.i18n.map["events.general.want-delete-this-title"]
                                yes_but = jQuery.i18n.map["events.general.yes-delete-event"];
                            }
                             CountlyHelpers.confirm(msg, "popStyleGreen",function(result) {
                                if (!result) {return true;}
                                countlyEvent.delete_events(changeList,function(result)
                                {
                                    if(result==true)
                                    {
                                        var msg = {title:jQuery.i18n.map["common.success"], message: jQuery.i18n.map["events.general.events-deleted"], sticky:false,clearAll:true,type:"ok"};
                                        CountlyHelpers.notify(msg);
                                        self.refresh(true,false);
                                    }
                                    else
                                        CountlyHelpers.alert(jQuery.i18n.map["events.general.update-not-successful"],"red");
                                });
                            },[jQuery.i18n.map["common.no-dont-delete"],yes_but],{title:title,image:"delete-an-event"});
                        }
                    }
                   $("#events-general-action").clySelectSetSelection("", jQuery.i18n.map["events.general.action.perform-action"]);
                }
            });
            
            //save chenges for one event
            $("#events-apply-changes").on("click", function () {
                var eventMap = {};  
                var eventKey = $("#events-settings-table").find(".event_key").val().replace("\\", "\\\\").replace("\$", "\\u0024").replace(".", "\\u002e");;   
                eventMap[eventKey] = {};
                var omitted_segments={};
                
                if($("#events-settings-table").find(".event_name").val()!="" && $("#events-settings-table").find(".event_name").val()!=eventKey)
                    eventMap[eventKey]["name"] = $("#events-settings-table").find(".event_name").val();
                if($("#events-settings-table").find(".event_count").val()!="")
                    eventMap[eventKey]["count"] = $("#events-settings-table").find(".event_count").val();
                if($("#events-settings-table").find(".event_description").val()!="")
                    eventMap[eventKey]["description"] = $("#events-settings-table").find(".event_description").val();
                if($("#events-settings-table").find(".event_sum").val()!="")
                    eventMap[eventKey]["sum"] = $("#events-settings-table").find(".event_sum").val();
                if($("#events-settings-table").find(".event_dur").val()!="")
                    eventMap[eventKey]["dur"] = $("#events-settings-table").find(".event_dur").val();
                var ch = $("#events-settings-table").find(".event_visible").first();
                if($(ch).is(":checked")==true)
                    eventMap[eventKey]["is_visible"]=true;
                else
                    eventMap[eventKey]["is_visible"]=false;
                omitted_segments[eventKey] = $('#event-management-projection').val() ||[];
                
                if(self.compare_arrays(omitted_segments[eventKey],self.activeEvent.omittedSegments)&& omitted_segments[eventKey].length>0)
                {
                    CountlyHelpers.confirm(jQuery.i18n.map["event.edit.omitt-warning"], "red",function(result) {
                        if (!result) {return true;}
                        countlyEvent.update_map(JSON.stringify(eventMap),"","",JSON.stringify(omitted_segments),function(result)
                        {
                            if(result==true)
                            {
                                CountlyHelpers.notify({type:"ok",title:jQuery.i18n.map["common.success"], message:jQuery.i18n.map["events.general.changes-saved"], sticky:false,clearAll:true});
                                self.refresh(true,false);
                            }
                            else
                                CountlyHelpers.alert(jQuery.i18n.map["events.general.update-not-successful"],"red");
                        });
                    });
                }
                else
                {
                    countlyEvent.update_map(JSON.stringify(eventMap),"","",JSON.stringify(omitted_segments),function(result)
                    {
                        if(result==true)
                        {
                            CountlyHelpers.notify({type:"ok",title:jQuery.i18n.map["common.success"], message:jQuery.i18n.map["events.general.changes-saved"], sticky:false,clearAll:true});
                            self.refresh(true,false);
                        }
                        else
                            CountlyHelpers.alert(jQuery.i18n.map["events.general.update-not-successful"],"red");
                    });
                }
            });
                
            if(this.selectedSubmenu=="")
            {
                $('#events-event-settings').css("display","none");
                $('#events-custom-settings').css("display","block");
            }
            else
            {
                $('#events-event-settings').css("display","block");
                $('#events-custom-settings').css("display","none")
            }
        }
    },
    compare_arrays:function(array1,array2)
    {
        if(array1.length!=array2.length)
            return true;
        
        for(var p=0; p<array1.length; p++)
        {
            if(array2.indexOf(array1[p])==-1)
                return true;
            if(array1.indexOf(array2[p])==-1)
                return true;
        }
        return false;
    },
    check_changes:function()
    {
        var changed=false;
        if($("#events-settings-table").find(".event_name").val()!=this.activeEvent.name)
            changed=true;
        if($("#events-settings-table").find(".event_count").val()!=this.activeEvent.count)
            changed=true;
        if($("#events-settings-table").find(".event_description").val()!=this.activeEvent.description)
            changed=true;
        if($("#events-settings-table").find(".event_dur").val()!=this.activeEvent.dur)
            changed=true;
        if($("#events-settings-table").find(".event_sum").val()!=this.activeEvent.sum)
            changed=true;
         
        var ch = $("#events-settings-table").find(".event_visible").first();
        if($(ch).is(":checked")!=this.activeEvent.is_visible)
            changed=true;
            
        if(this.compare_arrays(($('#event-management-projection').val() ||[]),this.activeEvent.omittedSegments))
            changed=true;

        if(changed)
        {
           $("#events-apply-changes").css("display","block"); 
           this.preventHashChange = true;
        }
        else
        {
            $("#events-apply-changes").css("display","none");
            this.preventHashChange = false;
        }
    },
    refresh:function(eventChanged){
        var self = this;
        if(eventChanged)
        {
            $.when(countlyEvent.initialize(true)).then(function () {
                if (app.activeView != self) {
                    return false;
                }
                self.renderCommon(true);
                newPage = $("<div>" + self.template(self.templateData) + "</div>");
                $(self.el).find("#events-settings-table").html(newPage.find("#events-settings-table").html());//Event settings
                $("#events-event-settings .widget-header .title").html(self.activeEvent.name);//change event settings title
                $(self.el).find("#events-custom-settings-table").html(newPage.find("#events-custom-settings-table").html());  //update general settings table   
                $(self.el).find("#event-nav-eventitems").html(newPage.find("#event-nav-eventitems").html());//reset navigation
                
                $('#event-filter-types div[data-value="all"]').html('<span>'+jQuery.i18n.map["events.general.show.all"]+'</span> ('+self.templateData['allCount']+')');
                $('#event-filter-types div[data-value="visible"]').html('<span>'+jQuery.i18n.map["events.general.show.visible"]+'</span> ('+self.templateData['visibleCount']+')');
                $('#event-filter-types div[data-value="hidden"]').html('<span>'+jQuery.i18n.map["events.general.show.hidden"]+'</span> ('+self.templateData['hiddenCount']+')');
                
                if(self.visibilityFilter===true)
                    $('#events-general-filter').clySelectSetSelection("", jQuery.i18n.map["events.general.show.visible"]+' ('+self.templateData['visibleCount']+')');
                else if(self.visibilityFilter===false)
                    $('#events-general-filter').clySelectSetSelection("", jQuery.i18n.map["events.general.show.hidden"]+' ('+self.templateData['hiddenCount']+')');
                else
                    $('#events-general-filter').clySelectSetSelection("", jQuery.i18n.map["events.general.show.all"]+' ('+self.templateData['allCount']+')');
                self.pageScript(); //add scripts
                app.localize($("#events-event-settings"));
                app.localize($("#events-custom-settings-table"));
                
                if(self.selectedSubmenu==""){
                    $('#events-event-settings').css("display","none");
                    $('#events-custom-settings').css("display","block");
                }
                else{
                    $('#events-event-settings').css("display","block");
                    $('#events-custom-settings').css("display","none")
                }
                $( "#events-apply-order" ).trigger( "eventSettingsTableUpdated" );
            });
        }
    }  
});

window.EventsOverviewView = countlyView.extend({
    beforeRender: function() {},
    initialize:function () {
        var previousEvent = countlyCommon.getPersistentSettings()["activeEvent_" + countlyCommon.ACTIVE_APP_ID];
        if(previousEvent)
            countlyEvent.setActiveEvent(previousEvent);
        this.template = Handlebars.compile($("#template-events-overview").html()); 
    },
    overviewTableScripts:function()
    {
        var self=this;
    //dragging and droping for event overview list
        $(".events-table").sortable({
            items:"tbody tr",
            revert:true,
            handle:"td:first-child",
            helper:function (e, elem) {
                elem.children().each(function () {
                    $(this).width($(this).width());
                });
                elem.css("width",(parseInt(elem.width())-2)+"px");//to not go over line
                elem.addClass("moving");
                return elem;
            },
            cursor:"move",
            containment:"parent",
            tolerance:"pointer",
            placeholder:"event-row-placeholder",
            stop:function (e, elem) {
                elem.item.removeClass("moving");
                self.order_changed();
                $("#update_overview_button").removeClass('disabled');
            }
        });
        //removes item from overview List
        $(".delete-event-overview").on("click",function(){
            if ($(this).attr("data-order-key")) {
                var oldKey = $(this).attr("data-order-key");
                self.overviewList.splice(oldKey,1);
                for(var i=0; i<self.overviewList.length; i++)
                {
                    self.overviewList[i]["order"] = i;
                }
            }
            self.refresh(true,true);
            $("#update_overview_button").removeClass('disabled');
        });
    },
    pageScripts:function()
    {
        var self=this;
        var sparkline_settings = {
            type: 'line',
            height: '40',
            width: '150',
            lineColor: '#49c1e9',
            fillColor: "transparent",
            lineWidth: 1.5,
            spotColor: '#49c1e9',
            minSpotColor: "transparent",
            maxSpotColor: "transparent",
            highlightSpotColor: "transparent",
            highlightLineColor: "transparent",
            spotRadius: 3,
            drawNormalOnTop: false,
            disableTooltips: true
        };
       
        $(".spark-count").sparkline('html', sparkline_settings);
        sparkline_settings.lineColor = "#ff8700";
        sparkline_settings.spotColor = "#ff8700";
        $(".spark-sum").sparkline('html', sparkline_settings);
        sparkline_settings.lineColor = "#0EC1B9";
        sparkline_settings.spotColor = "#0EC1B9";
        $(".spark-dur").sparkline('html', sparkline_settings);

        //tooltip
        $('.show-my-event-description').tooltipster({
			theme: ['tooltipster-borderless', 'tooltipster-borderless-customized'],
			contentCloning: true,
			interactive: true,
			trigger: 'hover',
			side: 'right',
            zIndex: 2,
            maxWidth: 250,
            functionReady: function(instance, helper) {
               
			}
		});
        self.overviewTableScripts();
    },
    reloadGraphs:function(){
        var self = this;
        countlyEvent.getOverviewData(function(dd){
            self.overviewGraph = dd;
            for(var i=0; i<dd.length; i++)
            {
                var tt = self.fixTrend(dd[i]["trend"])
                dd[i]["trendClass"] =tt["class"];
                dd[i]["trendText"] = tt["text"];
                dd[i]["classdiv"] = tt["classdiv"];
                dd[i]["arrow_class"] = tt["arrow_class"];
                dd[i]["count"] = countlyCommon.getShortNumber(Math.round(dd[i]["count"] * 100) / 100);
            }           
            self.refresh(true);
        });
    },
    dateChanged: function () {
        var self=this;
        self.reloadGraphs();
    },
    order_changed:function(){
        //self.eventmap
        var self = this;
        var NeweventOrder = [];
        $("#event-overview-drawer .events-table").find(".delete-event-overview").each(function () {
           if ($(this).attr("data-order-key")){
                var i = $(this).attr("data-order-key");
                $(this).attr("data-order-key",NeweventOrder.length);
                NeweventOrder.push({"order": NeweventOrder.length,"eventKey":self.overviewList[i].eventKey,"eventProperty":self.overviewList[i].eventProperty,"eventName":self.overviewList[i].eventName,"propertyName":self.overviewList[i].propertyName});
                $("#update_overview_button").removeClass('disabled');
            }
        });
        self.overviewList = NeweventOrder;
    },
    fixTrend:function(changePercent) {
        var value ={"class":"","text":"","classdiv":"u","arrow_class":"trending_up"};
        if (changePercent.indexOf("-") !== -1) {
            value["text"] = changePercent;
            value["class"] = "down";
            value["classdiv"]="d";
            value["arrow_class"] = "trending_down";
        } else if (changePercent.indexOf("∞") !== -1 || changePercent.indexOf("NA") !== -1) {
            value["text"] = jQuery.i18n.map["events.overview.unknown"];
            value["class"] = "unknown";
            value["arrow_class"] = "trending_flat";
        } else {
            value["text"] = changePercent;
            value["class"] = "up";
        }
        return value;
    },
    renderCommon:function (isRefresh) {
        var self = this;
        this.currentOverviewList = countlyEvent.getOverviewList();
        this.eventmap = countlyEvent.getEventMap();
        
        var app_admin = false;
        
        var active_app_id = countlyGlobal["member"]['active_app_id'];
        if(countlyGlobal["member"].global_admin || countlyGlobal["member"]["admin_of"].indexOf(countlyGlobal["member"]['active_app_id'])>-1)
        {
            app_admin=true;
        }

        this.templateData = {
            "logo-class":"events",
            "event-map": this.eventmap,
            "overview-list":this.overviewList || [],
            "overview-graph":this.overviewGraph || [],
            "tabledGraph":[],
            "admin_rights":app_admin,
            "event-count":Object.keys(this.eventmap).length
        };
        if(!this.overviewGraph)
            this.overviewGraph = [];
         if(!this.overviewList)
            this.overviewList = [];
                
        this.templateData["overview-length"] =  this.templateData["overview-graph"].length;
        this.templateData["overview-table-length"] =  this.templateData["overview-list"].length;
       
        if (!isRefresh) {
            var overviewList = countlyEvent.getOverviewList();
            this.overviewList = [];
            for(var i=0; i<overviewList.length; i++)
            {
                var evname = overviewList[i].eventKey;
                var propname = overviewList[i].eventProperty;
                if(this.eventmap && this.eventmap[overviewList[i].eventKey] && this.eventmap[overviewList[i].eventKey].name)
                    evname = this.eventmap[evname]["name"];
                if(this.eventmap && this.eventmap[overviewList[i].eventKey] && this.eventmap[overviewList[i].eventKey][propname])
                    propname = this.eventmap[overviewList[i].eventKey][propname];
                this.overviewList.push({"order":i,"eventKey":overviewList[i].eventKey,"eventProperty":overviewList[i].eventProperty,"eventName":evname,"propertyName":propname});
            }
            
            this.templateData["overview-list"] = this.overviewList;
            this.templateData["overview-length"] =  this.templateData["overview-graph"].length;
            this.templateData["overview-table-length"] =  this.templateData["overview-list"].length;
            $(this.el).html(this.template(this.templateData));         
            
            self.pageScripts();
        
            //selecting event or property in drawer
            $(".cly-select").on("cly-select-change", function(e, selected) {
                var event =  $("#events-overview-event").clySelectGetSelection();
                var property = $("#events-overview-attr").clySelectGetSelection();
                if(event && property)
                    $("#add_to_overview").removeClass('disabled');
                else
                    $("#add_to_overview").addClass('disabled');
            });
            //open editing drawer
            $("#events-overview-show-configure").on("click", function () {
                $(".cly-drawer").removeClass("open editing");
                $("#events-overview-table").css("max-height",$( window ).height()-280);
                $("#event-overview-drawer").addClass("open");
                $("#event-overview-drawer").find(".close").off("click").on("click", function() {
                    $(this).parents(".cly-drawer").removeClass("open");
                });
            });
            
            //Add new item to overview
            $("#add_to_overview").on("click", function () {
               var event =  $("#events-overview-event").clySelectGetSelection();
               var property = $("#events-overview-attr").clySelectGetSelection();
                if(event && property)
                {
                    if(self.overviewList.length<12)
                    {
                        //check if not duplicate
                        var unique_over = true;
                        for(var i=0; i<self.overviewList.length; i++)
                        {
                            if(self.overviewList[i].eventKey == event && self.overviewList[i].eventProperty == property)
                                unique_over=false;
                        }
                        if(unique_over==true)
                        {
                            self.overviewList.push({eventKey:event,eventProperty:property,eventName:self.eventmap[event].name,propertyName:self.eventmap[event][property]||jQuery.i18n.map["events.table."+property],order:self.overviewList.length});
                            $("#events-overview-event").clySelectSetSelection("", jQuery.i18n.map["events.overview.choose-event"]);
                            $("#events-overview-attr").clySelectSetSelection("", jQuery.i18n.map["events.overview.choose-property"]);
                            $("#update_overview_button").removeClass('disabled');
                        }
                        else
                        {
                            var msg = {title:jQuery.i18n.map["common.error"], message: jQuery.i18n.map["events.overview.have-already-one"],info:"",type:"error", sticky:false,clearAll:true};
                            CountlyHelpers.notify(msg);
                        }
                    }
                    else
                    {
                        var msg = {title:jQuery.i18n.map["common.error"], message: jQuery.i18n.map["events.overview.max-c"],info:"",type:"error", sticky:false,clearAll:true};
                        CountlyHelpers.notify(msg);
                    } 
                }
                self.refresh(true,true);
            });
            
            //save changes made in overview drawer
            $("#update_overview_button").on("click", function () {
                countlyEvent.update_map("","",JSON.stringify(self.overviewList),"",function(result)
                {
                    if(result==true)
                    {
                        var msg = {title:jQuery.i18n.map["common.success"], message: jQuery.i18n.map["events.general.changes-saved"], sticky:false,clearAll:true,type:"ok"};
                        CountlyHelpers.notify(msg);
                        $("#event-overview-drawer").removeClass('open');
                        $.when(countlyEvent.initialize(true)).then(function () {
                            var overviewList = countlyEvent.getOverviewList();
                            this.overviewList = [];
                            for(var i=0; i<overviewList.length; i++)
                            {
                                this.overviewList.push({"order":i,"eventKey":overviewList[i].eventKey,"eventProperty":overviewList[i].eventProperty,"eventName":overviewList[i].eventName,"propertyName":overviewList[i].propertyName});
                            }
                            self.dateChanged();
                        });
                    }
                    else
                        CountlyHelpers.alert(jQuery.i18n.map["events.general.update-not-successful"],"red");
                });
            });
            self.reloadGraphs();
            
            $(window).on('resize', function () {
                self.refresh(true);
            });
        }
    },
    refresh:function(dataChanged,onlyTable)
    {
        var self = this;
        if(dataChanged)
        {
            self.renderCommon(true);
            if(onlyTable!==true)
            {
                var window_width = $(window).width();
                var per_line = 4;
                if(window_width<1200)
                    per_line=3;
                if(window_width<750)
                    per_line=2;
                if(window_width<500)
                    per_line = 1;
                    
                var lineCN = Math.ceil(self.overviewGraph.length/per_line);
                var displayOverviewTable = [];
                for(var i=0; i<lineCN; i++)
                {
                    displayOverviewTable[i] = [];
                    for(var j=0; j<per_line; j++)
                    {
                        if(i*per_line+j<self.overviewGraph.length)
                            displayOverviewTable[i][j] = self.overviewGraph[i*per_line+j];
                        else 
                            displayOverviewTable[i][j] = {};
                    }
                }
                self.templateData['tabledGraph'] = displayOverviewTable;
            }      
           
            newPage = $("<div>" + self.template(self.templateData) + "</div>");
            $(self.el).find("#events-overview-table-wrapper").html(newPage.find("#events-overview-table-wrapper").html());//Event settings
            app.localize($("#events-overview-table-wrapper"));
            if(onlyTable!==true)
            {
                $(self.el).find("#eventOverviewWidgets").html(newPage.find("#eventOverviewWidgets").html()); //redraw widgets
                app.localize($("#eventOverviewWidgets"));
                self.pageScripts();
                self.overviewTableScripts();
            }
            else
                self.overviewTableScripts();
            if($(".events-empty-block").length>0)
            {
                $(".events-empty-block").first().parent().css("height",$( window ).height()-230);
            }
            
        }
    }
});

window.EventsView = countlyView.extend({
    showOnGraph: {"event-count":true, "event-sum":true, "event-dur":true},
    beforeRender: function() {},
    initialize:function () {
        var previousEvent = countlyCommon.getPersistentSettings()["activeEvent_" + countlyCommon.ACTIVE_APP_ID];
        if(previousEvent)
            countlyEvent.setActiveEvent(previousEvent);
        this.template = Handlebars.compile($("#template-events").html());
    },
    pageScript:function () {
        $(".event-container").unbind("click");
        $(".segmentation-option").unbind("click");
        $(".big-numbers").unbind("click");

        var self = this;

        $(".event-container").on("click", function () {
            var tmpCurrEvent = $(this).data("key");
            for(var i in self.showOnGraph){
                self.showOnGraph[i] = true;
            }
            $(".event-container").removeClass("active");
            $(this).addClass("active");

            countlyEvent.setActiveEvent(tmpCurrEvent, function() { self.refresh(true); });
        });

        $(".segmentation-option").on("click", function () {
            var tmpCurrSegmentation = $(this).data("value");
            countlyEvent.setActiveSegmentation(tmpCurrSegmentation, function() {
                if(countlyEvent.hasLoadedData())
                { 
                    self.renderCommon(true);
                    newPage = $("<div>" + self.template(self.templateData) + "</div>");

                    $(self.el).find("#event-nav .scrollable").html(function () {
                        return newPage.find("#event-nav .scrollable").html();
                    });

                    $(self.el).find(".widget-footer").html(newPage.find(".widget-footer").html());
                    $(self.el).find("#edit-event-container").replaceWith(newPage.find("#edit-event-container"));

                    var eventData = countlyEvent.getEventData();
                    self.drawGraph(eventData);
                    self.pageScript();

                    self.drawTable(eventData);
                    app.localize();
                }
            });
        });

        $(".big-numbers").on("click", function () {
            if ($(".big-numbers.selected").length == 1) {
                if ($(this).hasClass("selected")) {
                    return true;
                } else {
                    self.showOnGraph[$(this).data("type")] = true;
                }
            }
            else if ($(".big-numbers.selected").length > 1) {
                if ($(this).hasClass("selected"))
                    self.showOnGraph[$(this).data("type")] = false;
                else
                    self.showOnGraph[$(this).data("type")] = true;
            }
            
            $(this).toggleClass("selected");

            self.drawGraph(countlyEvent.getEventData());
        });

        if (countlyGlobal['admin_apps'][countlyCommon.ACTIVE_APP_ID]) {
            $("#edit-events-button").show();
        }
        setTimeout(self.resizeTitle, 100);       
    },
    drawGraph:function(eventData) {
        $(".big-numbers").removeClass("selected");
        var use = [];
        var cnt = 0;
        for(var i in this.showOnGraph){
            if(this.showOnGraph[i]){
                $(".big-numbers."+i).addClass("selected");
                use.push(cnt);
            }
            else{

            }
            cnt++;
        }
        
        var data = [];
        for(var i = 0; i < use.length; i++){
            if (eventData.dataLevel == 2) {
                data.push(eventData.chartDP.dp[use[i]]);
            } else {
                data.push(eventData.chartDP[use[i]]);
            }
        }
        
       
        if (eventData.dataLevel == 2) {
            eventData.chartDP.dp = data;
            countlyCommon.drawGraph(eventData.chartDP, "#dashboard-graph", "bar", {series:{stack:null}});
        } else {
            eventData.chartDP = data;
            countlyCommon.formatSecondForDP(eventData.chartDP, jQuery.i18n.map["views.duration"]);
            countlyCommon.drawTimeGraph(eventData.chartDP, "#dashboard-graph");
        }
    },
    drawTable:function(eventData) {
        if (this.dtable && this.dtable.fnDestroy) {
            this.dtable.fnDestroy(true);
        }

        $("#event-main").append('<table class="d-table" cellpadding="0" cellspacing="0"></table>');

        var aaColumns = [];

        if (countlyEvent.isSegmentedView()) {
            aaColumns.push({"mData":"curr_segment", "sTitle":jQuery.i18n.map["events.table.segmentation"]});
        } else {
            aaColumns.push({"mData":"date", "sType":"customDate", "sTitle":jQuery.i18n.map["common.date"]});
        }

        aaColumns.push({"mData":"c", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle":eventData.tableColumns[1]});

        if (eventData.tableColumns[2]) {
            if(eventData.tableColumns[2] == jQuery.i18n.map["events.table.dur"]){
                aaColumns.push({"mData":"dur", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatSecond(d); }, "sTitle":eventData.tableColumns[2]});
                aaColumns.push({"sClass": "dynamic-col", "mData":function(row, type){if(row.c == 0 || row.dur == 0) return 0; else return (row.dur/row.c);}, sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatSecond(d); }, "sTitle":jQuery.i18n.map["events.table.avg-dur"]});
            }
            else{
                aaColumns.push({"mData":"s", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle":eventData.tableColumns[2]});
                aaColumns.push({"sClass": "dynamic-col","mData":function(row, type){if(row.c == 0 || row.s == 0) return 0; else return (row.s/row.c);}, sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle":jQuery.i18n.map["events.table.avg-sum"]});
            }
        }
        
        if (eventData.tableColumns[3]) {
            aaColumns.push({"mData":"dur", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatSecond(d);}, "sTitle":eventData.tableColumns[3]});
            aaColumns.push({"sClass": "dynamic-col","mData":function(row, type){if(row.c == 0 || row.dur == 0) return 0; else return (row.dur/row.c);}, sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatSecond(d); }, "sTitle":jQuery.i18n.map["events.table.avg-dur"]});
        }
        
        this.dtable = $('.d-table').dataTable($.extend({}, $.fn.dataTable.defaults, {
            "aaData": eventData.chartData,
            "aoColumns": aaColumns
        }));

        $(".d-table").stickyTableHeaders();
    },
    resizeTitle:function(){
        var dW = $("#date-selector").width();
        var bW = $("#events-widget-header").width();
        $("#events-widget-header .dynamic-title").css("max-width",(bW-dW-20)+"px");
    },
    getColumnCount:function(){
        return $(".dataTable").first().find("thead th").length;
    },
    getDataColumnCount:function(cnt){
        if(cnt === 3)
            return 4;
        if(cnt === 4)
            return 6;
        return cnt;
    },
    renderCommon:function (isRefresh) {
        var eventData = countlyEvent.getEventData(),
            eventSummary = countlyEvent.getEventSummary(),
            self = this;

        var showManagmentButton = false;
        (countlyGlobal["member"].global_admin || countlyGlobal["member"]["admin_of"].indexOf(countlyGlobal["member"]['active_app_id'])>-1)
        {
            showManagmentButton =true;
        }
        var eventCount = countlyEvent.getEvents().length;
        this.templateData = {
            "page-title":eventData.eventName.toUpperCase(),
            "event-description":eventData.eventDescription,
            "logo-class":"events",
            "events":countlyEvent.getEvents(),
            "event-map":countlyEvent.getEventMap(),
            "segmentations":countlyEvent.getEventSegmentations(),
            "active-segmentation":countlyEvent.getActiveSegmentation(),
            "big-numbers":eventSummary,
            "chart-data":{
                "columnCount":eventData.tableColumns.length,
                "columns":eventData.tableColumns,
                "rows":eventData.chartData
            },
            "showManagmentButton":showManagmentButton,
            "event-count": eventCount
        };

        if (!isRefresh) {
            $(this.el).html(this.template(this.templateData));
            if(eventCount>0)
            {
                for(var i in this.showOnGraph){
                    self.showOnGraph[i] = $(".big-numbers.selected."+i).length;
                }
                this.drawGraph(eventData);
                this.drawTable(eventData);
                this.pageScript();
            }
            $(window).on('resize', function () {
                self.resizeTitle();
            });
        }
    },
    refresh:function (eventChanged, segmentationChanged) {
        var self = this;
        self.resizeTitle();
        $.when(countlyEvent.initialize(eventChanged)).then(function () {

            if (app.activeView != self) {
                return false;
            }
            if(countlyEvent.hasLoadedData())
            {  
            self.renderCommon(true);
            
            newPage = $("<div>" + self.template(self.templateData) + "</div>");
            if(self.templateData['event-count']>0)
            {
                $(self.el).find("#event-nav .scrollable").html(function () {
                    return newPage.find("#event-nav .scrollable").html();
                });
                
                $(self.el).find(".events-general-description").html(function () {
                    return newPage.find(".events-general-description").html();
                });

                // Segmentation change does not require title area refresh
                if (!segmentationChanged) {
                    if ($("#event-update-area .cly-select").length && !eventChanged) {
                        // If there is segmentation for this event and this is not an event change refresh
                        // we just refresh the segmentation select's list
                        $(self.el).find("#event-update-area .select-items").html(function () {
                            return newPage.find("#event-update-area .select-items").html();
                        });

                        $("#event-update-area .select-items>div").addClass("scroll-list");
                        $("#event-update-area .select-items").find(".scroll-list").slimScroll({
                            height:'100%',
                            start:'top',
                            wheelStep:10,
                            position:'right',
                            disableFadeOut:true
                        });

                        $(".select-items .item").click(function () {
                            var selectedItem = $(this).parents(".cly-select").find(".text");
                            selectedItem.text($(this).text());
                            selectedItem.data("value", $(this).data("value"));
                        });
                    } else {
                        // Otherwise we refresh whole title area including the title and the segmentation select
                        // and afterwards initialize the select since we replaced it with a new element
                        $(self.el).find("#event-update-area").replaceWith(newPage.find("#event-update-area"));
                    }
                }

                $(self.el).find(".widget-footer").html(newPage.find(".widget-footer").html());
                $(self.el).find("#edit-event-container").replaceWith(newPage.find("#edit-event-container"));

                var eventData = countlyEvent.getEventData();
                for(var i in self.showOnGraph){
                    if(!$(".big-numbers."+i).length)
                        self.showOnGraph[i] = false;
                }
                for(var i in self.showOnGraph){
                    if(self.showOnGraph[i])
                        $(".big-numbers."+i).addClass("selected");
                }

                self.drawGraph(eventData);
                self.pageScript();

                if (eventChanged || segmentationChanged) {
                    self.drawTable(eventData);
                } else if (self.getColumnCount() != self.getDataColumnCount(eventData.tableColumns.length)) {
                    self.drawTable(eventData);
                } else {
                    CountlyHelpers.refreshTable(self.dtable, eventData.chartData);
                }
            }
            app.localize();
            $('.nav-search').find("input").trigger("input");
            }
        });
        }
});

window.DashboardView = countlyView.extend({
    renderCommon:function () {
        if(countlyGlobal["apps"][countlyCommon.ACTIVE_APP_ID]){
            var type = countlyGlobal["apps"][countlyCommon.ACTIVE_APP_ID].type;
            type = jQuery.i18n.map["management-applications.types."+type] || type;
            $(this.el).html("<div id='no-app-type'><h1>"+jQuery.i18n.map["common.missing-type"]+": "+type+"</h1><h3><a href='#/manage/plugins'>"+jQuery.i18n.map["common.install-plugin"]+"</a><br/>"+jQuery.i18n.map["common.or"]+"<br/><a href='#/manage/apps'>"+jQuery.i18n.map["common.change-app-type"]+"</a></h3></div>");
        }
        else{
            $(this.el).html("<div id='no-app-type'><h1>"+jQuery.i18n.map["management-applications.no-app-warning"]+"</h1><h3><a href='#/manage/apps'>"+jQuery.i18n.map["common.add-new-app"]+"</a></h3></div>");
        }
    }
});

window.DownloadView = countlyView.extend({
    renderCommon:function () {
        var self = this;
        if(!this.task_id)
        {
            $(this.el).html('<div id="no-app-type"><h1>'+jQuery.i18n.map["downloading-view.download-not-available-title"]+'</h1><p>'+jQuery.i18n.map["downloading-view.download-not-available-text"]+'</p></div>');
            return;
        }
        
        countlyTaskManager.fetchResult(this.task_id,function(res)
        {
             var myhtml = '<div id="no-app-type"><h1>'+jQuery.i18n.map["downloading-view.download-title"]+'</h1>';
            if(res && res.data)
            {
                self.link = countlyCommon.API_PARTS.data.r+"/app_users/download/"+res.data+"?auth_token="+countlyGlobal.auth_token+"&app_id="+countlyCommon.ACTIVE_APP_ID;
               window.location=self.link;
                

                if(self.link)
                {
                   myhtml+='<p><a href="'+self.link+'">'+jQuery.i18n.map["downloading-view.if-not-start"]+'</a></p>';
                }
                myhtml+="</div>";
            }
            else
            {
                var myhtml = '<div id="no-app-type"><h1>'+jQuery.i18n.map["downloading-view.download-not-available-title"]+'</h1><p>'+jQuery.i18n.map["downloading-view.download-not-available-text"]+'</p></div>';
            }
            $(self.el).html(myhtml);
        
        });
    }
});

window.LongTaskView = countlyView.extend({
	initialize:function () {
        this.template = Handlebars.compile($("#report-manager-template").html());
        this.taskCreatedBy = 'manually';
        this.types = {
            "all": jQuery.i18n.map["common.all"],
            "funnels": jQuery.i18n.map["sidebar.funnels"] || "Funnels",
            "drill": jQuery.i18n.map["drill.drill"] || "Drill"
        };
         
        this.runTimeTypes = {
            "all": jQuery.i18n.map["common.all"],
            "auto-refresh": jQuery.i18n.map["taskmanager.auto"],
            "none-auto-refresh": jQuery.i18n.map["taskmanager.manual"] 
        }

        this.states = {
            "all": jQuery.i18n.map["common.all"],
            "running":jQuery.i18n.map["common.running"],
            "rerunning":jQuery.i18n.map["taskmanager.rerunning"],
            "completed":jQuery.i18n.map["common.completed"],
            "errored":jQuery.i18n.map["common.errored"]
        };
    },
    beforeRender: function() {
        return $.when(countlyTaskManager.initialize(null, 
            {"manually_create": true}
        )).then(function () {});
    },
    getStatusColor: function(status){
      if(status === "completed")
          return "#2FA732";
      if(status === "errored")
          return "#D63E40";
      return "#E98010";
    },
    reporInputValidator: function (){
        var report_name = $("#report-name-input").val();
        var report_desc = $("#report-desc-input").val();
        // var global = $("#report-global-option").hasClass("selected") || false;
        var autoRefresh = $("#report-refresh-option").hasClass("selected");
        var period = $("#single-period-dropdown").clySelectGetSelection();
        if(!report_name || !report_desc || (autoRefresh && ! period)){
            $("#create-report").addClass("disabled")
            return false;
        }
        $("#create-report").removeClass("disabled")
        return true;
    },
    loadReportDrawerView: function(id){
        $("#current_report_id").text(id);
        var data = countlyTaskManager.getResults();
        for (var i = 0; i < data.length; i++) {
            if(data[i]._id === id){
                $("#report-name-input").val(data[i].report_name);
                $("#report-desc-input").val(data[i].report_desc);

                if(data[i].global){
                    $("#report-global-option").addClass("selected");
                    $("#report-private-option").removeClass("selected");
                }else{
                    $("#report-private-option").addClass("selected");
                    $("#report-global-option").removeClass("selected");
                }

                if(data[i].autoRefresh){
                    $("#report-refresh-option").addClass("selected");
                    $("#report-onetime-option").removeClass("selected");
                    $("#single-period-dropdown").clySelectSetSelection(
                        data[i].period_desc, 
                        jQuery.i18n.map["taskmanager.last-" + data[i].period_desc]
                    );
                }else{
                    $("#report-refresh-option").removeClass("selected");
                    $("#report-onetime-option").addClass("selected");
                    
                }
            }
        }
        $("#report-widget-drawer").addClass("open");
    },
    initDrawer: function(){
        var self = this; 

        $('#report-widge-close').off("click").on("click", function () {
            $("#report-widget-drawer").removeClass("open");
        });
        $("#report-global-option").off("click").on("click", function(){
            $("#report-global-option").addClass("selected");
            $("#report-private-option").removeClass("selected");
            self.reporInputValidator();
        })
        $("#report-private-option").off("click").on("click", function(){
            $("#report-private-option").addClass("selected");
            $("#report-global-option").removeClass("selected");
            self.reporInputValidator();
        })

        $("#report-onetime-option").off("click").on("click", function(){
            $("#report-onetime-option").addClass("selected");
            $("#report-refresh-option").removeClass("selected");
            $("#report-period-block").css("display", "none");
            self.reporInputValidator();
        })
        $("#report-refresh-option").off("click").on("click", function(){
            $("#report-refresh-option").addClass("selected");
            $("#report-onetime-option").removeClass("selected");
            $("#report-period-block").css("display", "block");
            self.reporInputValidator();
        })
        
        $("#single-period-dropdown").clySelectSetItems([
            { value: 'today', name: jQuery.i18n.map["taskmanager.last-today"]},
            { value: '7days', name: jQuery.i18n.map["taskmanager.last-7days"]},
            { value: '30days', name: jQuery.i18n.map["taskmanager.last-30days"]}
        ]);

        $("#single-period-dropdown").clySelectSetSelection("", jQuery.i18n.map["drill.select_a_period"] );

        $("#report-name-input").off("keyup").on("keyup", function(){
            self.reporInputValidator();
        })
        $("#report-desc-input").off("keyup").on("keyup", function(){
            self.reporInputValidator();
        })
        $("#single-period-dropdown").off("cly-select-change").on("cly-select-change", function (e, selected) {
            self.reporInputValidator();
        })

        $("#create-report").off("click").on("click", function(){
            var report_id =  $("#current_report_id").text();
            var canSubmit = self.reporInputValidator();
            if(!canSubmit){
                return;
            }
            var report_name = $("#report-name-input").val();
            var report_desc = $("#report-desc-input").val();
            var global_permission = $("#report-global-option").hasClass("selected");
            var autoRefresh = $("#report-refresh-option").hasClass("selected");
            var period = $("#single-period-dropdown").clySelectGetSelection();
            if(autoRefresh && !period)
                return CountlyHelpers.alert(jQuery.i18n.map["drill.report_fileds_remind"],
                        "green",
                        function (result) { });
            
           
            return $.ajax({
                type:"GET",
                url:countlyCommon.API_PARTS.data.w + '/tasks/edit',
                data: { 
                    "task_id": report_id,
                    "api_key": countlyGlobal.member.api_key,
                    "app_id": countlyCommon.ACTIVE_APP_ID,
                    "report_name": report_name,
                    "report_desc": report_desc,
                    "global": global_permission,
                    "autoRefresh": autoRefresh,
                    "period_desc": autoRefresh ?  period : null
                },
                dataType: "jsonp",
                success:function (json) {
                    self.refresh();
                    $("#report-widget-drawer").removeClass("open");
                },
                error: function(){
                    self.refresh();
                    $("#report-widget-drawer").removeClass("open");
                }
            });
        })
        $("#create-report").addClass("disabled")
    },
    renderCommon:function (isRefresh) {  
        var self = this;
        this.templateData = {
            "page-title": jQuery.i18n.map["report-maanger.manually-created-title"],
            "filter1": this.types,
            "active-filter1": jQuery.i18n.map["taskmanager.select-origin"],
            "filter2": this.runTimeTypes,
            "active-filter2": jQuery.i18n.map["common.select-type"],
            "filter3": this.states,
            "active-filter3": jQuery.i18n.map["common.select-status"],
            "graph-description": jQuery.i18n.map['taskmanager.automatically-table-remind']
        };
        var typeCodes = ['manually', 'automatically'];
        if (!isRefresh) {
            $(this.el).html(this.template(this.templateData));
            this.tabs = $("#reports-manager-tabs").tabs();
            this.tabs.on( "tabsselect", function( event, ui ) {
                self.taskCreatedBy = typeCodes[ui.index];
                $("#report-manager-table-title").text(jQuery.i18n.map["report-maanger." + self.taskCreatedBy +"-created-title"]);
                self.refresh();
            })
            this.renderTable();
            this.initDrawer();
        }
        if (self.taskCreatedBy === 'manually') {
            $("#report-manager-graph-description").text(jQuery.i18n.map['taskmanager.manually-table-remind'])
        } else {
            $("#report-manager-graph-description").text(jQuery.i18n.map['taskmanager.automatically-table-remind'])
        }
        var manuallyColumns       = [true, true, true, false, true, true,  true, true, true,  false,  false]
        var automaticallyColumns  = [false,false,true, true,  true, false, true, false, false, true,  true]
        
        if (self.taskCreatedBy === 'manually') {
            manuallyColumns.forEach(function(vis,index){
                self.dtable.fnSetColumnVis( index, vis );
            })
            $(".report-manager-idget-header .filter2-segmentation").show()
            $(".report-manager-idget-header .filter3-segmentation").hide()
        } else {
            automaticallyColumns.forEach(function(vis,index){
                self.dtable.fnSetColumnVis( index, vis );
            })
            $(".report-manager-idget-header .filter2-segmentation").hide()
            $(".report-manager-idget-header .filter3-segmentation").show()
        }
    },
    renderTable: function () {
        var self = this;
        var tableColumns = [];
        tableColumns = [
            { "mData": function(row, type){return row.report_name || "-";}, "sType":"string", "sTitle": jQuery.i18n.map["report-manager.name"], "bSortable": true, "sClass":"break" },
            { "mData": function(row, type){return row.report_desc || "-";}, "sType":"string", "sTitle": jQuery.i18n.map["report-manager.desc"], "bSortable": false, "sClass":"break" },
            { "mData": function(row, type){return row.name || row.meta || "";}, "sType":"string", "sTitle": jQuery.i18n.map["report-manager.data"], "bSortable": false, "sClass":"break" },
            { "mData":  function(row, type){return '<span class="status-color" style="color:'+self.getStatusColor(row.status)+';"><i class="fa fa-circle" aria-hidden="true"></i>' + (self.states[row.status] || row.status)+"</span>";}, "sType":"string", "sTitle": jQuery.i18n.map["common.status"] },
            { "mData":  function(row, type){return '<span class="status-color" style="color:'+self.getStatusColor(row.status)+';"><i class="fa fa-circle" aria-hidden="true"></i>' +  row.type +"</span>";}, "sType":"string", "sTitle": jQuery.i18n.map["taskmanager.origin"] },
            { "mData": function(row, type){return row.autoRefresh ? jQuery.i18n.map["taskmanager.auto"] : jQuery.i18n.map["taskmanager.manual"];}, "sType":"string", "sTitle": jQuery.i18n.map["common.type"], "bSortable": false, "sClass":"break" },
            { "mData": function(row, type){return row.period_desc || "-";}, "sType":"string", "sTitle": jQuery.i18n.map["report-manager.period"], "bSortable": false, "sClass":"break" },
            { "mData": function(row, type){return row.global === false ? 'Private': 'Global';}, "sType":"string", "sTitle": jQuery.i18n.map["report-manager.visibility"], "bSortable": false, "sClass":"break" },
            { "mData": function(row, type){
                if(type == "display"){
                    return countlyCommon.formatTimeAgo(row.start);
                }else return row.start;},
                "sType":"string", 
                "sTitle": jQuery.i18n.map["common.last_updated"] 
            },
            { "mData": function(row, type){
                if(type == "display"){
                    return countlyCommon.formatTimeAgo(row.start);
                }else return row.start;}, "sType":"string", "sTitle": jQuery.i18n.map["common.started"] 
            },
            { "mData": function(row, type){
                var time = 0;
                if(row.status === "running" || row.status === "rerunning"){
                    time = Math.max(new Date().getTime() - row.start, 0);
                }
                else if(row.end && row.end > row.start){
                    time = row.end - row.start;
                }
                if(type == "display"){
                    return countlyCommon.formatTime(Math.round(time/1000));
                }else return time;}, "sType":"numeric", "sTitle": jQuery.i18n.map["events.table.dur"] 
            },
            { "mData": function(row, type){
                return '<a class="cly-list-options"></a>';
            }, "sType":"string", "sTitle": "", "sClass":"shrink center", bSortable: false  }
        ];
        
        this.dtable = $('#data-table').dataTable($.extend({}, $.fn.dataTable.defaults, {
            "aaData": countlyTaskManager.getResults(),
            "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                $(nRow).attr("data-id", aData._id);
                $(nRow).attr("data-name", aData.report_name || aData.name || '-');
            },
            "aoColumns": tableColumns
        }));
        this.dtable.stickyTableHeaders();
        this.dtable.fnSort( [ [3,'desc'] ] );
        $(this.el).append('<div class="cly-button-menu tasks-menu" tabindex="1">' +
            '<a class="item view-task" href="" data-localize="common.view"></a>' +
            '<a class="item rerun-task" data-localize="taskmanager.rerun"></a>' +
            '<a class="item edit-task" data-localize="taskmanager.edit"></a>' +
            '<a class="item delete-task" data-localize="common.delete"></a>' +
        '</div>');
        CountlyHelpers.initializeTableOptions();
        
        $(".cly-button-menu").on("cly-list.click", function(event, data){
            var id = $(data.target).parents("tr").data("id");
            var reportName = $(data.target).parents("tr").data("name");
            if (id) {
                var row = countlyTaskManager.getTask(id);
                $(".tasks-menu").find(".edit-task").data("id", id);
                if (countlyGlobal["member"].global_admin || countlyGlobal["admin_apps"][countlyCommon.ACTIVE_APP_ID]) {
                    $(".tasks-menu").find(".delete-task").data("id", id);
                    $(".tasks-menu").find(".delete-task").data("name", reportName);
                }
                else {
                    $(".tasks-menu").find(".delete-task").hide();
                }
                
                if(row.status !== "running" && row.status !== "rerunning"){
                    if(row.view && row.hasData){
                        $(".tasks-menu").find(".view-task").attr("href", row.view+row._id).data("localize", "common.view").text(jQuery.i18n.map["common.view"]).show();
                    }
                    else{
                        $(".tasks-menu").find(".view-task").hide();
                    }
                    if(row.request){
                        $(".tasks-menu").find(".rerun-task").data("id", id).show();
                    }
                    else{
                        $(".tasks-menu").find(".rerun-task").hide();
                    }
                }
                else{
                    if(row.view && row.hasData){
                        $(".tasks-menu").find(".view-task").attr("href", row.view+row._id).data("localize", "taskmanager.view-old").text(jQuery.i18n.map["taskmanager.view-old"]).show();
                    }
                    else{
                        $(".tasks-menu").find(".view-task").hide();
                    }
                }


                if(self.taskCreatedBy === 'manually'){
                    $(".tasks-menu").find(".rerun-task").hide();
                    $(".tasks-menu").find(".edit-task").show();
                }else{
                    $(".tasks-menu").find(".edit-task").hide();
                    $(".tasks-menu").find(".rerun-task").show();
                }
            }
        });
        
        $(".cly-button-menu").on("cly-list.item", function (event, data) {
            var el = $(data.target);
            var id = el.data("id");
            if(id){
                if(el.hasClass("delete-task")){
                    CountlyHelpers.confirm(jQuery.i18n.prop("taskmanager.confirm-delete","<b>"+el.data("name")+"</b>"), "popStyleGreen", function (result) {
                        if (!result) {
                            return true;
                        }
                        countlyTaskManager.del(id, function(){
                            self.refresh();
                        });
                    },[jQuery.i18n.map["common.no-dont-delete"],jQuery.i18n.map["taskmanager.yes-delete-report"]],{title:jQuery.i18n.map["taskmanager.confirm-delete-title"],image:"delete-report"});
                }
                else if(el.hasClass("rerun-task")){
                    CountlyHelpers.confirm(jQuery.i18n.map["taskmanager.confirm-rerun"], "popStyleGreen", function (result) {
                        if (!result) {
                            return true;
                        }
                        countlyTaskManager.update(id, function(res){
                            if(res.result === "Success"){
                                countlyTaskManager.monitor(id, true);
                                self.refresh();
                            }
                            else{
                                CountlyHelpers.alert(res.result, "red");
                            }
                        });
                    },[jQuery.i18n.map["common.no-dont-do-that"],jQuery.i18n.map["taskmanager.yes-rerun-report"]],{title:jQuery.i18n.map["taskmanager.confirm-rerun-title"],image:"reruning-task"});
                }
                else if(el.hasClass("edit-task")) {
                    self.loadReportDrawerView(id);
                }
            }
        });
        
        $(".filter1-segmentation .segmentation-option").on("click", function () {
            if(!self._query)
                self._query = {};
            self._query.type = $(this).data("value");
            if(self._query.type === "all")
                delete self._query.type;
            self.refresh();
        });
        
        $(".filter2-segmentation .segmentation-option").on("click", function () {
            if(!self._query)
                self._query = {};
            self._query.autoRefresh = $(this).data("value") === 'auto-refresh';
            if($(this).data("value") === "all")
                delete self._query.autoRefresh;
            self.refresh();
        }); 
        $(".filter3-segmentation .segmentation-option").on("click", function () {
            if(!self._query)
                self._query = {};
            self._query.status = $(this).data("value");
            if(self._query.status === "all")
                delete self._query.status;
            self.refresh();
        });
    },
    refresh:function () {
        var self = this;
        self._query = self._query ? self._query : {};
        var queryObject = {};
        Object.assign(queryObject, self._query)
        if(self.taskCreatedBy === 'manually') {
            queryObject["manually_create"] = true;
            delete queryObject.status;
        } else {
            queryObject["manually_create"] = {$ne: true}
            delete queryObject.autoRefresh;
        }
        $.when(countlyTaskManager.initialize(true, queryObject)).then(function () {
            if (app.activeView != self) {
                return false;
            }
            self.renderCommon(true);
            var data = countlyTaskManager.getResults();
            CountlyHelpers.refreshTable(self.dtable, data);
            app.localize();
        });
    }
});

window.VersionHistoryView = countlyView.extend({
    initialize:function (){
        this.template = Handlebars.compile($("#version-history-template").html());
    },
    beforeRender: function() {
       return $.when(countlyVersionHistoryManager.initialize()).then(function () {});
    },
    renderCommon:function (isRefresh) {
        //provide template data
        this.templateData = {"page-title":jQuery.i18n.map["version_history.page-title"]};
        
        var tableData = countlyVersionHistoryManager.getData() || [];
        if(!Array.isArray(tableData))
            tableData=[];
        if(tableData.length==0)
            tableData.push({"version":countlyGlobal["countlyVersion"], "updated":Date.now()});
        else
            tableData[tableData.length-1]["version"]+=(" "+jQuery.i18n.map["version_history.current-version"]);

        var self = this; 
        if(!isRefresh) {
            //set data
            $(this.el).html(this.template(this.templateData));
            
            this.dtable = $('#data-table').dataTable($.extend({"searching":false,"paging":false}, $.fn.dataTable.defaults, {
                "aaData": tableData,
                "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    $(nRow).attr("data-id", aData._id);
                    //$(nRow).attr("data-name", aData.report_name || aData.name || '-');
                },
                "aoColumns": [
                    { "mData": function(row, type){ return row.version}, "sType":"string", "sTitle": jQuery.i18n.map["version_history.version"], "bSortable": false, "sClass":"break" },
                    { "mData": function(row, type){return new Date(row.updated);}, "sType":"numeric", "sTitle": jQuery.i18n.map["version_history.upgraded"], "bSortable": true, "sClass":"break" }
                ]
            }));
            self.dtable.fnSort( [ [1,'desc'] ] );
        }
    }
});
//register views
app.sessionView = new SessionView();
app.userView = new UserView();
app.loyaltyView = new LoyaltyView();
app.countriesView = new CountriesView();
app.frequencyView = new FrequencyView();
app.deviceView = new DeviceView();
app.platformView = new PlatformView();
app.appVersionView = new AppVersionView();
app.carrierView = new CarrierView();
app.resolutionView = new ResolutionView();
app.durationView = new DurationView();
app.manageAppsView = new ManageAppsView();
app.manageUsersView = new ManageUsersView();
app.eventsView = new EventsView();
app.dashboardView = new DashboardView();
app.eventsBlueprintView = new EventsBlueprintView();
app.eventsOverviewView = new EventsOverviewView();
app.longTaskView = new LongTaskView();
app.DownloadView = new DownloadView();
app.VersionHistoryView =  new VersionHistoryView();

app.route("/analytics/sessions","sessions", function () {
	this.renderWhenReady(this.sessionView);
});
app.route("/analytics/users","users", function () {
	this.renderWhenReady(this.userView);
});
app.route("/analytics/loyalty","loyalty", function () {
	this.renderWhenReady(this.loyaltyView);
});
app.route("/analytics/countries","countries", function () {
	this.renderWhenReady(this.countriesView);
});
app.route("/analytics/frequency","frequency", function () {
	this.renderWhenReady(this.frequencyView);
});
app.route("/analytics/devices","devices", function () {
	this.renderWhenReady(this.deviceView);
});
app.route("/analytics/platforms","platforms", function () {
	this.renderWhenReady(this.platformView);
});
app.route("/analytics/versions","versions", function () {
	this.renderWhenReady(this.appVersionView);
});
app.route("/analytics/carriers","carriers", function () {
	this.renderWhenReady(this.carrierView);
});
app.route("/analytics/resolutions","resolutions", function () {
	this.renderWhenReady(this.resolutionView);
});
app.route("/analytics/durations","durations", function () {
	this.renderWhenReady(this.durationView);
});
app.route("/manage/apps","manageApps", function () {
	this.renderWhenReady(this.manageAppsView);
});
app.route("/manage/users","manageUsers", function () {
    this.manageUsersView._id = null;
	this.renderWhenReady(this.manageUsersView);
});
app.route('/manage/users/:id', 'manageUsersId', function (id) {
    this.manageUsersView._id = id;
	this.renderWhenReady(this.manageUsersView);
});
app.route("/manage/tasks","longTasks", function () {
	this.renderWhenReady(this.longTaskView);
});
app.route("/analytics/events","events", function () {
	this.renderWhenReady(this.eventsView);
});

app.route('/exportedData/AppUserExport/:task_id', 'userExportTask', function (task_id) {
    this.DownloadView.task_id = task_id;
    this.renderWhenReady(this.DownloadView);
});

app.route('/versions', 'version_history', function () {
    this.renderWhenReady(this.VersionHistoryView);
});

app.route("/analytics/events/:subpageid","events", function (subpageid) {
    this.eventsView.subpageid = subpageid;
    if(subpageid=='blueprint')
    {
        if(countlyGlobal["member"].global_admin || countlyGlobal["member"]["admin_of"].indexOf(countlyCommon.ACTIVE_APP_ID)>-1){
            this.renderWhenReady(this.eventsBlueprintView); 
        }
        else
            app.navigate("/analytics/events", true);
    }
    else if(subpageid=='overview')
        this.renderWhenReady(this.eventsOverviewView);
    else
        this.renderWhenReady(this.eventsView)
});

app.addAppSwitchCallback(function(appId){
   if(countlyGlobal["member"].global_admin || countlyGlobal["member"]["admin_of"].indexOf(appId)>-1)
        $('.sidebar-menu #events-submenu .events-blueprint-side-menu').css("display","block");  
    else
        $('.sidebar-menu #events-submenu .events-blueprint-side-menu').css("display","none");
});


//to not allow leaving events blueprint page if
function checkIfEventViewHaveNotUpdatedChanges(){

    if(app.eventsBlueprintView && app.eventsBlueprintView.preventHashChange==true)
    {
        var movemeto = Backbone.history.getFragment();
        if(movemeto !="/analytics/events/blueprint")
        {
            CountlyHelpers.confirm(jQuery.i18n.map["events.general.want-to-discard"], "red",function(result) {
                if (!result) {window.location.hash  ="/analytics/events/blueprint";}
                else
                {
                    app.eventsBlueprintView.preventHashChange=false;
                    window.location.hash = movemeto;
                }
            },[jQuery.i18n.map["events.general.cancel"],jQuery.i18n.map['events.general.confirm']]); 
           return false;
       }
       else
            return true;
    }
    else
        return true;
}

Backbone.history.urlChecks.push(checkIfEventViewHaveNotUpdatedChanges);


$.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
  //jqXHR.setRequestHeader('X-CSRFToken', csrf_token);
    if(countlyGlobal.auth_token)
    {
        var testurl = originalOptions.url;
        var urlParts = testurl.split('/');
        var partcn = urlParts.length-1;
        
       //if url is valid+auth_token and api_key not given
       if(urlParts[partcn].indexOf('auth_token=')==-1 && urlParts[partcn].indexOf('api_key=')==-1 && urlParts[0]=='' && (urlParts[1]=='o' || urlParts[1]=='i'))
       {
            //token and key is not given in url
            //add token in header
            if(typeof (originalOptions.data)=== 'string')
            {
                if(originalOptions.data.indexOf('auth_token=')==-1 && originalOptions.data.indexOf('api_key')==-1)
                {
                    jqXHR.setRequestHeader('countly-token', countlyGlobal.auth_token);
                }
            }
            else
            {
                jqXHR.setRequestHeader('countly-token', countlyGlobal.auth_token);
            }
        }
        
    } 
});
