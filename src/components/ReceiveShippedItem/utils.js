export const convertToSlipData = ({
  staffSlipContext = {},
  transaction = {},
  intl = { formatDate: () => null },
  timeZone,
  locale,
  slipName,
}) => {
  const {
    item = {},
    request = {},
    requester = {},
  } = staffSlipContext;

  return {
    'staffSlip.Name': slipName,
    'requester.firstName': requester.firstName,
    'requester.lastName': requester.lastName,
    'requester.middleName': requester.middleName,
    'requester.addressLine1': requester.addressLine1,
    'requester.addressLine2': requester.addressLine2,
    'requester.country': requester.countryId
      ? intl.formatMessage({ id: `stripes-components.countries.${requester.countryId}` })
      : '',
    'requester.city': requester.city,
    'requester.stateProvRegion': requester.region,
    'requester.zipPostalCode': requester.postalCode,
    'requester.barcode': requester.barcode,
    'requester.barcodeImage': requester.barcode ? `<Barcode>${requester.barcode}</Barcode>` : '',
    'item.title': item.title,
    'item.primaryContributor': item.primaryContributor,
    'item.allContributors': item.allContributors,
    'item.barcode': item.barcode,
    'item.barcodeImage': `<Barcode>${item.barcode}</Barcode>`,
    'item.callNumber': item.callNumber,
    'item.callNumberPrefix': item.callNumberPrefix,
    'item.callNumberSuffix': item.callNumberSuffix,
    'item.enumeration': item.enumeration,
    'item.volume': item.volume,
    'item.chronology': item.chronology,
    'item.copy': item.copy,
    'item.yearCaption': item.yearCaption,
    'item.materialType': item.materialType,
    'item.loanType': item.loanType,
    'item.numberOfPieces': item.numberOfPieces,
    'item.descriptionOfPieces': item.descriptionOfPieces,
    'item.lastCheckedInDateTime': item.lastCheckedInDateTime,
    'item.fromServicePoint': item.fromServicePoint,
    'item.toServicePoint': item.toServicePoint,
    'item.effectiveLocationInstitution': item.effectiveLocationInstitution,
    'item.effectiveLocationCampus': item.effectiveLocationCampus,
    'item.effectiveLocationLibrary': item.effectiveLocationLibrary,
    'item.effectiveLocationSpecific': item.effectiveLocationSpecific,
    'request.servicePointPickup': request.servicePointPickup,
    'request.deliveryAddressType': request.deliveryAddressType,
    'request.requestExpirationDate': request.requestExpirationDate
      ? intl.formatDate(request.requestExpirationDate, { timeZone, locale })
      : request.requestExpirationDate,
    'request.holdShelfExpirationDate': request.holdShelfExpirationDate
      ? intl.formatDate(request.holdShelfExpirationDate, { timeZone, locale })
      : request.holdShelfExpirationDate,
    'request.requestID': request.requestID,
    'request.patronComments': request.patronComments,
    'transaction.shippedItemBarcode': transaction.hold?.shippedItemBarcode,
    'transaction.itemAgencyCode': transaction.hold?.itemAgencyCode,
    'transaction.folioItemBarcode': transaction.hold?.folioItemBarcode,
  };
};
