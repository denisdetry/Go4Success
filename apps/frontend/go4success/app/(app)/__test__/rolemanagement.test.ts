import React from "react";
import RoleManagement from '../rolemanagement'

import {render} from '@testing-library/react-native';


describe('rolemanagement screen',() => {

    it('should make post or patch or delete request',() => {

        const page = render(<RoleManagement />);

        const saveButton = page.getByTestId("saveChange");



    })

})