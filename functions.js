
var dbPath = "db.json";
var commonVendors = {"Apple, Inc.":true,"Google":true,"Microsoft":true,"Samsung Electronics Co.,Ltd":true};

// persistent database
var db = {devices: {}};

// load database from file if it exists
if(fileExists(dbPath))
{
    db = loadJSON(dbPath);
    log("database loaded from " + dbPath);

}

function createDevice(device)
{
    db.devices[device.mac] = device;
}

function updateDevice(device)
{
    var known = db.devices[device.mac];

    known.last_seen = device.last_seen;
    if (device.meta)
    {
        for( var name in device.meta.values )
        {
            if(!(name in known.meta.values))
            {
                known.meta.values[name] = device.meta.values[name];
            }
        }
    }
    db.devices[device.mac] = known;
}

function onNewDevice(event) {
    var device = event.data;
    if (!device)
    {
        return;
    }

    // filter out common vendors just like nrfconnect does
    if (device.vendor in commonVendors)
    {
        return;
    }

    if(device.mac in db.devices)
    {
        // known device
        updateDevice(device);
    }
    else
    {
        // new device
        createDevice(device);
    }
    saveJSON(db, dbPath);
}
