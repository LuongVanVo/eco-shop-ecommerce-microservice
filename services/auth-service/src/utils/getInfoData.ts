import _ from 'lodash';

export const getInfoData = (fields: string[], data: any) => {
    return _.pick(data, fields)
}