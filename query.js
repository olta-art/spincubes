export function getProject(id) {
  // TODO: Check `royaltyRecpient` should not be `royaltyRecipient`?
  return `
    query {
      project(id: "${id}") {
        id
        implementation
        projectId
        createdAtTimestamp
        editionSize
        totalMinted
        name
        symbol
        creator {
          id
        }
        editions {
          burnedAtBlockNumber
          burnedAtTimeStamp
          createdAtBlockNumber
          createdAtTimestamp
          createdAtTransactionHash
          number
          id
          owner {
            id
          }
          prevOwner {
            id
          }
          seed
          uri
        }
        description
        royaltyBPS
        royaltyRecpient
        lastAddedVersion {
          image {
            url
            hash
          }
          animation {
            url
            hash
          }
        }
        versions {
          id
          label
          createdAtTimestamp
          animation {
            url
            hash
          }
          image {
            url
            hash
          }
          patchNotes {
            url
            hash
          }
        }
        dutchAuctionDrops(where: { project: "${id}" }) {
          id
          startPrice
          startTimestamp
          status
          endPrice
          endTimestamp
          approved
          duration
          numberOfPriceDrops
          creator {
            id
          }
          curator {
            id
          }
          project {
            editionSize
          }
          auctionCurrency {
            id
            decimals
            symbol
            name
          }
          previousPurchases {
            amount
            createdAtTimestamp
            currency {
              decimals
              name
              symbol
            }
            collector {
              id
            }
            edition {
              number
              seed
            }
          }
        }
      }
    }`
}
