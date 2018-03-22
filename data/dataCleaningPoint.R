## Load Libraries 
library(readr)
library(ggmap)

## Read in points data
PHA <- read_csv("PHA_PolicyMap.csv",
                col_types = cols(`Zip Code` = col_character()))
HUD <- read_csv("HUD_PolicyMap.csv")

## Clean data
colnames(PHA)
colnames(PHA) <- c("propID", "propName", "Address", "City", "State", "zipCode"
                   ,"yrBuilt", "totalUnits"
                   ,"numResidents", "pctOccupied","avgHHSize","avgHHIncome", "avgHHRentContrib"
                   ,"avgFedSpendPerUnit","hhIncAsPctAMI","pctHHsELI","pctDisabledResidents"
                   ,"pctSeniorHHs","aptTypes", "physInspScore","physInspDt","physConditCateg")
PHA$ownerName <- "Philadelphia Housing Authority"
PHA$ownerType <- "Government"
PHA <- subset(PHA, select = c("propID", "propName", "Address", "City", "State", "zipCode"
                              ,"yrBuilt","totalUnits", "pctOccupied"
                              ,"numResidents","avgHHSize","avgHHIncome"
                              ,"pctHHsELI","pctDisabledResidents"
                              ,"pctSeniorHHs","aptTypes", "physInspScore","physInspDt","physConditCateg"))


colnames(HUD)
colnames(HUD) <- c("propID", "propName", "yrBuilt", "ownerName", "ownerType", "Address"
                   ,"City", "State", "zipCode", "county", "totalUnits","numResidents"
                   ,"contractID","contractType","numAssistedUnits","affordExpirDt","delete","delete1"
                   ,"pctOccupied","avgHHSize","avgHHIncome", "avgHHRentContrib"
                   ,"avgFedSpendPerUnit","hhIncAsPctAMI","pctHHsELI","pctDisabledResidents"
                   ,"pctSeniorHHs","aptTypes", "physInspScore","physInspDt","physConditCateg")
HUD <- subset(HUD, select = c("propID", "propName", "Address", "City", "State", "zipCode"
                              ,"yrBuilt","totalUnits", "pctOccupied"
                              ,"numResidents","avgHHSize","avgHHIncome"
                              ,"pctHHsELI","pctDisabledResidents"
                              ,"pctSeniorHHs","aptTypes", "physInspScore","physInspDt","physConditCateg") )

subHousing <- rbind(PHA,HUD)
subHousing <- subset(subHousing, is.na(Address) == FALSE)
colnames(subHousing)

## Geocode 
for(i in 1:nrow(subHousing)) {
  result <- geocode(paste(subHousing$Address, subHousing$City, subHousing$State
                          , subHousing$zipCode, sep=" ")[i]
                    , output = "latlona", source = "google")
  subHousing$lon[i] <- as.numeric(result[1])
  subHousing$lat[i] <- as.numeric(result[2])
}
## Geocode those that didn't work above b/c over query limit
?geocode
for(i in 1:nrow(subHousing)) {
  if(is.na(subHousing$lon[i]) == TRUE) {
    result <- geocode(paste(subHousing$Address, subHousing$City, subHousing$State
                            , subHousing$zipCode, sep=" ")[i]
                      , output = "latlona", source = "google")
    subHousing$lon[i] <- as.numeric(result[1])
    subHousing$lat[i] <- as.numeric(result[2])
  }
}


## Export as geoJSON
writeOGR(subHousing, 'pointData.geojson','pointData', driver='GeoJSON')