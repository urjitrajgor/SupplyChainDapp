pragma solidity 0.5.0;

contract AssetsTracker{

    struct Asset{
        string name;
        string description;
        address manufacturer;
        bool initialized;
    }

    struct Tracking{
        address location;
        string uuid;
    }

    mapping(string => Asset) assetsStore;
    mapping(string => Tracking) locations;

    event AssetsCreate(address manufacturer, string uuid, address location);
    event AssetsTransfer(address from, address to, string uuid);

    function createAsset(string memory _name, string memory _description, string memory _uuid)public {
        assetsStore[_uuid].name = _name;
        assetsStore[_uuid].description = _description;
        assetsStore[_uuid].manufacturer = msg.sender;
        assetsStore[_uuid].initialized = true;
        locations[_uuid].location = msg.sender;
        locations[_uuid].uuid = _uuid;
        emit AssetsCreate(msg.sender, _uuid, msg.sender);
    }

    function transferAssets(string memory _uuid, address _to ) public{
        require(locations[_uuid].location == msg.sender, "You are not authorised to transfer this assets");
        locations[_uuid] = Tracking(_to, _uuid);
        emit AssetsTransfer(msg.sender, _to, _uuid);
    }

    function getAssetDetails(string memory _uuid) public view returns(string memory, string memory, address, address){
       return(assetsStore[_uuid].name, assetsStore[_uuid].description, assetsStore[_uuid].manufacturer, locations[_uuid].location);
    }

    function AssetLocation(string memory _uuid)public view returns(address){
        return(locations[_uuid].location);
    }

}