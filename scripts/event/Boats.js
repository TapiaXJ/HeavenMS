importPackage(Packages.client);
importPackage(Packages.tools);
importPackage(Packages.server.life);

//Time Setting is in millisecond
var closeTime = 50 * 1000; //The time to close the gate
var beginTime = 60 * 1000; //The time to begin the ride
var rideTime = 120 * 1000; //The time that require move to destination
var invasionTime = 30 * 1000; //The time that spawn balrog
var Orbis_btf;
var Boat_to_Orbis;
var Orbis_Boat_Cabin;
var Orbis_docked;
var Ellinia_btf;
var Ellinia_Boat_Cabin;
var Ellinia_docked;

function init() {
    Orbis_btf = em.getChannelServer().getMapFactory().getMap(200000112);
    Ellinia_btf = em.getChannelServer().getMapFactory().getMap(101000301);
    Boat_to_Orbis = em.getChannelServer().getMapFactory().getMap(200090010);
    Boat_to_Ellinia = em.getChannelServer().getMapFactory().getMap(200090000);
    Orbis_Boat_Cabin = em.getChannelServer().getMapFactory().getMap(200090011);
    Ellinia_Boat_Cabin = em.getChannelServer().getMapFactory().getMap(200090001);
    Ellinia_docked = em.getChannelServer().getMapFactory().getMap(101000300);
    Orbis_Station = em.getChannelServer().getMapFactory().getMap(200000100);
    Orbis_docked = em.getChannelServer().getMapFactory().getMap(200000111);
    
    scheduleNew();
}

function scheduleNew() {
    em.setProperty("docked", "true");
    Ellinia_docked.setDocked(true);
    Orbis_docked.setDocked(true);
    
    em.setProperty("entry", "true");
    em.setProperty("haveBalrog", "false");
    em.schedule("stopentry", closeTime);
    em.schedule("takeoff", beginTime);

    Boat_to_Orbis.killAllMonsters();
    Boat_to_Ellinia.killAllMonsters();
}

function stopentry() {
    em.setProperty("entry","false");
    Orbis_Boat_Cabin.resetReactors();
    Ellinia_Boat_Cabin.resetReactors();
}

function takeoff() {
    Orbis_btf.warpEveryone(Boat_to_Ellinia.getId());
    Ellinia_btf.warpEveryone(Boat_to_Orbis.getId());
    Ellinia_docked.broadcastShip(false);
    Orbis_docked.broadcastShip(false);
    
    em.setProperty("docked","false");
    Ellinia_docked.setDocked(false);
    Orbis_docked.setDocked(false);
    
    em.schedule("invasion", invasionTime);
    em.schedule("arrived", rideTime);
}

function arrived() {
    Boat_to_Orbis.warpEveryone(Orbis_Station.getId());
    Orbis_Boat_Cabin.warpEveryone(Orbis_Station.getId());
    Boat_to_Ellinia.warpEveryone(Ellinia_docked.getId());
    Ellinia_Boat_Cabin.warpEveryone(Ellinia_docked.getId());
    Orbis_docked.broadcastShip(true);
    Ellinia_docked.broadcastShip(true);
    Boat_to_Orbis.killAllMonsters();
    Boat_to_Ellinia.killAllMonsters();
    em.setProperty("haveBalrog", "false");
    scheduleNew();
}

function invasion() {
    if (Math.floor(Math.random() * 10) < 10) {
	var map1 = Boat_to_Ellinia;
	var pos1 = new java.awt.Point(-538, 143);
	map1.spawnMonsterOnGroundBelow(MapleLifeFactory.getMonster(8150000), pos1);
	map1.spawnMonsterOnGroundBelow(MapleLifeFactory.getMonster(8150000), pos1);

	var map2 = Boat_to_Orbis;
	var pos2 = new java.awt.Point(339, 148);
	map2.spawnMonsterOnGroundBelow(MapleLifeFactory.getMonster(8150000), pos2);
	map2.spawnMonsterOnGroundBelow(MapleLifeFactory.getMonster(8150000), pos2);

        em.setProperty("haveBalrog","true");
        Boat_to_Ellinia.broadcastShip(true);
        Boat_to_Orbis.broadcastShip(true);
    }
}

function cancelSchedule() {
}