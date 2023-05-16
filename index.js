let goods = []; // товары
let interval_id = 0;
let ignoreGoods = [ //Black list
  "ONYX",
  "DARK_ORB",
  "INK_SACK:3",
  "INK_SACK:4",
  "RARE_DIAMOND",
  "RED_NOSE",
  "SHINY_PRISM",
  "CANDY_CORN",
  "LAPIS_CRYSTAL",
  "MOLTEN_CUBE",
  "DIAMOND_ATOM",
  "OPTICAL_LENS",
  "ENDER_MONOCLE",
  "SUSPICIOUS_VIAL",
  "MIDAS_JEWEL",
  "ROCK_GEMSTONE",
  "SEEDS",
  "ENCHANTED_SEEDS",
  "JERRY_STONE",
  "PRECIOUS_PEARL",
  "BEATING_HEART",
  "PREMIUM_FLESH",
  "HARDENED_WOOD",
  "SADAN_BROOCH",
  "HOT_STUFF",
  "HAZMAT_ENDERMAN",
  "LUXURIOUS_SPOOL",
  "RED_SCARF",
  "DRAGON_SCALE",
  "REFINED_AMBER", 
  "METEOR_SHARD",
  "BULKY_STONE",
  "OBSIDIAN_TABLET",
  "ENDSTONE_GEODE"
];

function update() {

  const toTitleCase = str => str.replace(/(^\w|\s\w)(\S*)/g, (_,m1,m2) => m1.toUpperCase()+m2.toLowerCase());

  $.getJSON("https://api.hypixel.net/skyblock/bazaar?key=7c531fa2-f2b4-47bc-8156-b0846f0f2519", function (data) {
    //console.log(Object.values(data.products));
    goods = Object.values(data.products).filter((a) => !ignoreGoods.includes(a.product_id));
    //console.log(goods);
    goods = goods.map((a) => ({
      product_id: toTitleCase(a.product_id.replaceAll("_", " ")),
      buyPrice: a.quick_status.buyPrice,
      sellPrice: a.quick_status.sellPrice,
      buyVolume: a.quick_status.buyVolume,
      sellVolume: a.quick_status.sellVolume,
      Margin: a.quick_status.buyPrice - a.quick_status.sellPrice,
      MarginPercent: a.quick_status.buyPrice == 0 ? 0 : (1 - a.quick_status.sellPrice / a.quick_status.buyPrice),
    }));
    var dataGrid = $('#gridContainer').dxDataGrid('instance');
    dataGrid.option("dataSource", goods);
    DevExpress.ui.notify('Data has been updated');
  });
}
// Таблица
function autoupdate(e) {
  if (e.value) {
    interval_id = setInterval(update, 5000);
    update();
  } else {
    clearInterval(interval_id);
  }
}

$(() => {
  $('#button-update').dxButton({
    icon: 'refresh',
    type: 'success',
    text: 'Update',
    onClick: update
  });

  $('#checkbox-autoupdate').dxCheckBox({
    value: true,
    text: 'AutoRefresh',
    onValueChanged: autoupdate
  });


  const dataGrid = $('#gridContainer').dxDataGrid({
    dataSource: goods,
    keyExpr: 'product_id',
    columnsAutoWidth: true,
    showBorders: true,
    paging: {
      enabled: false
    },
    filterRow: {
      visible: true,
      applyFilter: 'auto',
    },
    searchPanel: {
      visible: true,
      width: 240,
      placeholder: 'Search...',
    },
    headerFilter: {
      visible: true,
    },
    columns: [{
      dataField: 'product_id',
      caption: 'Item name',
      width: 250,
      // headerFilter: {
      //   groupInterval: 10000,
      // },
    }, {
      dataField: 'buyPrice',
      alignment: 'right',
      dataType: 'number',
      format: ",##0.00",
      //width: 120,
    }, {
      dataField: 'sellPrice',
      alignment: 'right',
      dataType: 'number',
      format: ",##0.00",
    }, {
      dataField: 'buyVolume',
      alignment: 'right',
      dataType: 'number',
      format: ",##0",
    }, {
      dataField: 'sellVolume',
      alignment: 'right',
      dataType: 'number',
      format: ",##0",
    }, {
      dataField: 'Margin',
      alignment: 'right',
      dataType: 'number',
      format: ",##0.00",
    }, {
      dataField: 'MarginPercent',
      alignment: 'right',
      dataType: 'number',
      format: "##0%",
    }],
  }).dxDataGrid('instance');

  const applyFilterTypes = [{
    key: 'auto',
    name: 'Immediately',
  }, {
    key: 'onClick',
    name: 'On Button Click',
  }];

  const applyFilterModeEditor = $('#useFilterApplyButton').dxSelectBox({
    items: applyFilterTypes,
    value: applyFilterTypes[0].key,
    valueExpr: 'key',
    displayExpr: 'name',
    onValueChanged(data) {
      dataGrid.option('filterRow.applyFilter', data.value);
    },
  }).dxSelectBox('instance');

  $('#filterRow').dxCheckBox({
    text: 'Filter Row',
    value: true,
    onValueChanged(data) {
      dataGrid.clearFilter();
      dataGrid.option('filterRow.visible', data.value);
      applyFilterModeEditor.option('disabled', !data.value);
    },
  });

  $('#headerFilter').dxCheckBox({
    text: 'Header Filter',
    value: true,
    onValueChanged(data) {
      dataGrid.clearFilter();
      dataGrid.option('headerFilter.visible', data.value);
    },
  });

  function getOrderDay(rowData) {
    return (new Date(rowData.OrderDate)).getDay();
  }
});

autoupdate({value:true});

