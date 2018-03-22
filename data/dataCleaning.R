library(sf)
library(dplyr)
library(rjson)
library(plyr)
library(tidyr)
library(rgdal)
library(geojsonio)

hoods <- st_read("https://raw.githubusercontent.com/alisanroman/philly-hoods/master/data/Neighborhoods_Philadelphia.geojson")
tracts <- st_read("https://raw.githubusercontent.com/alisanroman/qapScoring/master/data/Census_Tracts_2010.geojson")

plot(hoods)
plot(tracts)

cent<-  st_centroid(tracts)
plot(cent)


hoodsTracts <- st_join(hoods, cent)
head(hoodsTracts)
plot(hoodsTracts)



ds_hoodsTracts <- data.frame(hoodsTracts) %>%
  select("mapname","TRACTCE10","GEOID10")
head(ds_hoodsTracts)


povertyURL <- "https://api.census.gov/data/2016/acs/acs5?get=B17001_001E,B17001_002E&for=tract:*&in=state:42&in=county:101&key=4d92e5c53d5b7046bae0b72874aceed0fde3e0b4" 
povertyDat <- fromJSON(file = povertyURL)
d = ldply(povertyDat)
head(d)
colnames(d) <- c("totalPop","poverty","state","county","tract")
povertyDat1 = d[-1,]
head(povertyDat1) 
povertyDat1 <- unite(povertyDat1,"FIPS", c("state","county","tract"),sep="",remove=TRUE)
head(povertyDat1)
povertyDat1$totalPop <- as.numeric(povertyDat1$totalPop)
povertyDat1$poverty <- as.numeric(povertyDat1$poverty)

homeownerURL <- "https://api.census.gov/data/2016/acs/acs5?get=B25003_001E,B25003_002E&for=tract:*&in=state:42&in=county:101&key=4d92e5c53d5b7046bae0b72874aceed0fde3e0b4"
homeownerDat <- fromJSON(file=homeownerURL)
homeownerDat <- ldply(homeownerDat)
head(homeownerDat)
colnames(homeownerDat) <- c("totalHH","homeowners","state","county","tract")
homeownerDat <- homeownerDat[-1,]
head(homeownerDat)
homeownerDat <- unite(homeownerDat,"FIPS",c("state","county","tract"),sep="",remove=TRUE)
homeownerDat$totalHH <- as.numeric(homeownerDat$totalHH)
homeownerDat$homeowners <- as.numeric(homeownerDat$homeowners)

## combine spatial & census data
combo <- merge(x=povertyDat1,y = homeownerDat, by="FIPS")
colnames(combo)[1] <- "GEOID10"

combo2 <- left_join(x=hoodsTracts, y = combo)
colnames(combo2)
combo2 <- subset(combo2,select=-c(name, listname, NAME10,cartodb_id,created_at,updated_at,STATEFP10
                                  ,COUNTYFP10,TRACTCE10
                                  ,NAMELSAD10,MTFCC10,FUNCSTAT10,OBJECTID))
names(combo2)
combo2$mapname <- as.character(combo2$mapname)

combo3 <- ddply(combo2, c("mapname"), summarise, 
                pop = sum(totalPop, na.rm = TRUE),
                pov = sum(poverty, na.rm = TRUE), 
                hhs = sum(totalHH, na.rm = TRUE),
                hom = sum(homeowners,na.rm=TRUE))

combo3$povPct <- ifelse(combo3$pop != 0, as.numeric(round((combo3$pov / combo3$pop) * 100,1)), NA)
combo3$homPct <- ifelse(combo3$hhs != 0, as.numeric(round((combo3$hom / combo3$hhs) * 100,1)), NA)

polyData <- left_join(x=hoods,y=combo3,by="mapname")
polyData <- subset(polyData,select = -c(cartodb_id,created_at,updated_at,name,listname))
plot(polyData)

geojson_write(input=polyData,file="polyData.geojson")

?geojson_write


writeOGR(polyData, 'polyData.geojson','polyData', driver='GeoJSON')
