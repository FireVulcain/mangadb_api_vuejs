const QUERY_HOME = `
query {
    trending:Page(page: 1, perPage: 6) {
        media(sort: TRENDING_DESC, type: MANGA, isAdult: false) {
            ...media
        }
    }
    popular:Page(page:1, perPage:6) {
        media(sort: POPULARITY_DESC, type: MANGA, isAdult: false) {
            ...media
        }
    }
    manhwa:Page(page:1, perPage:6) {
        media(sort: POPULARITY_DESC, type: MANGA, countryOfOrigin: "KR", isAdult: false) {
            ...media
        }
    }
    top:Page(page:1, perPage:10) {
        media(sort: SCORE_DESC, type: MANGA, isAdult: false) {
            ...media
        }
    }
}

fragment media on Media {
    id title {
        userPreferred
    }
    coverImage {
        extraLarge large color
    }
    startDate {
        year month day
    }
    endDate {
        year month day
    }
    bannerImage season description type format status episodes duration chapters volumes genres isAdult averageScore popularity mediaListEntry {
        id status
    }
}

`;

const QUERY_MANGA = `
query media($id:Int, $type:MediaType, $isAdult:Boolean) {
    Media(id: $id, type: $type, isAdult: $isAdult) {
        id title {
            userPreferred romaji english native
        }
        coverImage {
            extraLarge large
        }
        bannerImage startDate {
            year month day
        }
        endDate {
            year month day
        }
        description season seasonYear type format status episodes duration chapters volumes genres synonyms source(version:2)isAdult isLocked meanScore averageScore popularity favourites hashtag countryOfOrigin isLicensed isFavourite isRecommendationBlocked nextAiringEpisode {
            airingAt timeUntilAiring episode
        }
        relations {
            edges {
                id relationType(version: 2)node {
                    id title {
                        userPreferred
                    }
                    format type status bannerImage coverImage {
                        large
                    }
                }
            }
        }
        characterPreview:characters(perPage:6, sort:[ROLE, ID]) {
            edges {
                id role voiceActors(language: JAPANESE) {
                    id name {
                        full
                    }
                    language image {
                        large
                    }
                }
                node {
                    id name {
                        full
                    }
                    image {
                        large
                    }
                }
            }
        }
        staffPreview:staff(perPage:8) {
            edges {
                id role node {
                    id name {
                        full
                    }
                    language image {
                        large
                    }
                }
            }
        }
        studios {
            edges {
                isMain node {
                    id name
                }
            }
        }
        reviewPreview:reviews(perPage:2, sort:RATING_DESC) {
            pageInfo {
                total
            }
            nodes {
                id summary rating ratingAmount user {
                    id name avatar {
                        large
                    }
                }
            }
        }
        recommendations(perPage:7, sort:RATING_DESC) {
            pageInfo {
                total
            }
            nodes {
                id rating userRating mediaRecommendation {
                    id title {
                        userPreferred
                    }
                    format type status bannerImage coverImage {
                        large
                    }
                }
                user {
                    id name avatar {
                        large
                    }
                }
            }
        }
        externalLinks {
            site url
        }
        streamingEpisodes {
            site title thumbnail url
        }
        trailer {
            id site
        }
        rankings {
            id rank type format year season allTime context
        }
        tags {
            id name description rank isMediaSpoiler isGeneralSpoiler
        }
        mediaListEntry {
            id status score
        }
        stats {
            statusDistribution {
                status amount
            }
            scoreDistribution {
                score amount
            }
        }
    }
}
`;

const QUERY_CHARACTERS = `
query media($id:Int, $page:Int, $perPage:Int) {
    Media(id: $id) {
        id characters(page: $page, perPage: $perPage, sort: [ROLE, ID]) {
            pageInfo {
                total perPage currentPage lastPage hasNextPage
            }
            edges {
                id role voiceActors {
                    id name {
                        full
                    }
                    language image {
                        large
                    }
                }
                node {
                    id name {
                        full
                    }
                    image {
                        large
                    }
                }
            }
        }
    }
}
`;

const QUERY_STAFF = `
query media($id:Int, $page:Int) {
    Media(id: $id) {
        id staff(page: $page) {
            pageInfo {
                total perPage currentPage lastPage hasNextPage
            }
            edges {
                id role node {
                    id name {
                        full
                    }
                    image {
                        large
                    }
                }
            }
        }
    }
}
`;

const QUERY_REVIEW = `
query media($id:Int, $page:Int) {
    Media(id: $id) {
        id title {
            userPreferred
        }
        reviews(page:$page, sort:RATING_DESC) {
            pageInfo {
                total perPage currentPage lastPage hasNextPage
            }
            nodes {
                id summary rating ratingAmount user {
                    id name avatar {
                        large
                    }
                }
            }
        }
    }
}
`;

const QUERY_STATS = `
query($id:Int) {
    Media(id: $id) {
        id rankings {
            id rank type format year season allTime context
        }
        trends(sort:ID_DESC) {
            nodes {
                averageScore date trending popularity
            }
        }
        airingTrends:trends(releasing:true, sort:EPISODE_DESC) {
            nodes {
                averageScore inProgress episode
            }
        }
        distribution:stats {
            status:statusDistribution {
                status amount
            }
            score:scoreDistribution {
                score amount
            }
        }
    }
}
`;

const QUERY_SORT = `
query($page:Int=1 $id:Int $type:MediaType $isAdult:Boolean=false $search:String $format:[MediaFormat]$status:MediaStatus $countryOfOrigin:CountryCode $source:MediaSource $season:MediaSeason $year:String $onList:Boolean $yearLesser:FuzzyDateInt $yearGreater:FuzzyDateInt $episodeLesser:Int $episodeGreater:Int $durationLesser:Int $durationGreater:Int $chapterLesser:Int $chapterGreater:Int $volumeLesser:Int $volumeGreater:Int $licensedBy:[String]$genres:[String]$excludedGenres:[String]$tags:[String]$excludedTags:[String]$minimumTagRank:Int $sort:[MediaSort]=[POPULARITY_DESC, SCORE_DESC]) {
    Page(page: $page, perPage: 20) {
        pageInfo {
            total perPage currentPage lastPage hasNextPage
        }
        media(id:$id type:$type season:$season format_in:$format status:$status countryOfOrigin:$countryOfOrigin source:$source search:$search onList:$onList startDate_like:$year startDate_lesser:$yearLesser startDate_greater:$yearGreater episodes_lesser:$episodeLesser episodes_greater:$episodeGreater duration_lesser:$durationLesser duration_greater:$durationGreater chapters_lesser:$chapterLesser chapters_greater:$chapterGreater volumes_lesser:$volumeLesser volumes_greater:$volumeGreater licensedBy_in:$licensedBy genre_in:$genres genre_not_in:$excludedGenres tag_in:$tags tag_not_in:$excludedTags minimumTagRank:$minimumTagRank sort:$sort isAdult:$isAdult) {
            id title {
                userPreferred
            }
            coverImage {
                extraLarge large color
            }
            startDate {
                year month day
            }
            endDate {
                year month day
            }
            bannerImage season description type format status episodes duration chapters volumes genres isAdult averageScore popularity nextAiringEpisode {
                airingAt timeUntilAiring episode
            }
            mediaListEntry {
                id status
            }
            studios(isMain:true) {
                edges {
                    isMain node {
                        id name
                    }
                }
            }
        }
    }
}
`;

export { QUERY_MANGA, QUERY_HOME, QUERY_CHARACTERS, QUERY_STAFF, QUERY_REVIEW, QUERY_STATS, QUERY_SORT };
