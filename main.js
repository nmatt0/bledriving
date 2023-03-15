require("functions")

run('ble.recon on');

onEvent('ble.device.new', onNewDevice);
