import { IssuerName } from '../IssuerName';

describe('Test IssuerName VO', () => {
  test('when create account cash with positive number then check VO contain this amount', () => {
    const issuerName = 'NFLA';
    const result = IssuerName.create(issuerName);

    expect(result.value).toEqual(issuerName);
  });

  test('when create issuer name with only 1 digit then throw exception', () => {
    const issuerName = 'E';

    expect(() => {
      IssuerName.create(issuerName);
    }).toThrow(
      `Invalid issuer name: ${issuerName}.Must be contain only 4 word in upper or lower case`,
    );
  });
});
