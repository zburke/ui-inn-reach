import { FormattedMessage } from 'react-intl';

const fetchUserByUserId = async (userId, parentMutator) => {
  const { users: [user] } = await parentMutator.users.GET({
    params: {
      query: `id==${userId}`,
    },
  });

  return user;
};

export const validateUserId = (parentMutator) => async (value) => {
  if (!value) return undefined;

  const user = await fetchUserByUserId(value, parentMutator);

  return user
    ? undefined
    : <FormattedMessage id="ui-inn-reach.not-valid" />;
};
