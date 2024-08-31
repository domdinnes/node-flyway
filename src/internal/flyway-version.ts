
export enum FlywayVersion {
    // "V3.0.0", // Not supported
    // "V3.1.0", // Not supported
    // "V3.2.0", // Not supported
    // "V3.2.1", // Not supported
    "V4.0.0",
    "V4.0.1",
    "V4.0.2",
    "V4.0.3",
    "V4.1.0",
    "V4.1.1",
    "V4.1.2",
    "V4.2.0",
    "V5.0.0",
    "V5.0.1",
    "V5.0.2",
    "V5.0.3",
    "V5.0.4",
    "V5.0.5",
    "V5.0.6",
    "V5.0.7",
    "V5.1.0",
    "V5.1.1",
    "V5.1.3",
    "V5.1.4",
    "V5.2.0",
    "V5.2.1",
    "V5.2.2",
    "V5.2.3",
    "V5.2.4",
    "V6.0.0",
    "V6.0.1",
    "V6.0.2",
    "V6.0.3",
    "V6.0.4",
    "V6.0.5",
    "V6.0.6",
    "V6.0.7",
    "V6.0.8",
    "V6.1.0",
    "V6.1.1",
    "V6.1.2",
    "V6.1.3",
    "V6.1.4",
    "V6.2.0",
    "V6.2.1",
    "V6.2.2",
    "V6.2.3",
    "V6.2.4",
    "V6.3.0",
    "V6.3.1",
    "V6.3.2",
    "V6.3.3",
    "V6.4.0",
    "V6.4.1",
    "V6.4.2",
    "V6.4.3",
    "V6.4.4",
    "V6.5.0",
    "V6.5.1",
    "V6.5.2",
    "V6.5.3",
    "V6.5.4",
    "V6.5.5",
    "V6.5.6",
    "V6.5.7",
    "V7.0.0",
    "V7.0.1",
    "V7.0.2",
    "V7.0.3",
    "V7.0.4",
    "V7.1.0",
    "V7.1.1",
    "V7.10.0",
    "V7.11.0",
    "V7.11.1",
    "V7.11.2",
    "V7.11.3",
    "V7.11.4",
    "V7.12.0",
    "V7.12.1",
    "V7.13.0",
    "V7.14.0",
    "V7.14.1",
    "V7.15.0",
    "V7.2.0",
    "V7.2.1",
    "V7.3.0",
    "V7.3.1",
    "V7.3.2",
    "V7.4.0",
    "V7.5.0",
    "V7.5.1",
    "V7.5.2",
    "V7.5.3",
    "V7.5.4",
    "V7.6.0",
    "V7.7.0",
    "V7.7.1",
    "V7.7.2",
    "V7.7.3",
    "V7.8.0",
    "V7.8.1",
    "V7.8.2",
    "V7.9.0",
    "V7.9.1",
    "V7.9.2",
    "V8.0.0",
    "V8.0.1",
    "V8.0.2",
    "V8.0.3",
    "V8.0.4",
    "V8.0.5",
    "V8.1.0",
    "V8.2.0",
    "V8.2.1",
    "V8.2.2",
    "V8.2.3",
    "V8.3.0",
    "V8.4.0",
    "V8.4.1",
    "V8.4.2",
    "V8.4.3",
    "V8.4.4",
    "V8.5.0",
    "V8.5.1",
    "V8.5.10",
    "V8.5.11",
    "V8.5.12",
    "V8.5.13",
    "V8.5.2",
    "V8.5.3",
    "V8.5.4",
    "V8.5.5",
    "V8.5.6",
    "V8.5.7",
    "V8.5.8",
    "V8.5.9",
    "V9.0.0",
    "V9.22.3"
}


export const getUrlComponentsForFlywayVersion = (flywayVersion: FlywayVersion): {
    versionString: string,
    operatingSystemSpecificUrl: boolean
} => {
    switch(flywayVersion) {
        case FlywayVersion["V4.0.0"]: {
            return {
                versionString: "4.0",
                operatingSystemSpecificUrl: true
            };
        }
        case FlywayVersion["V5.0.0"]:
        {
            return {
                versionString: FlywayVersion[flywayVersion].substring(1),
                operatingSystemSpecificUrl: false
            }
        }
        default: {
            return {
                versionString: FlywayVersion[flywayVersion].substring(1),
                operatingSystemSpecificUrl: true
            };
        }
    }
}



// Mapping between extracted directory name and flyway version
export const getDirectoryNameForFlywayVersion = () => {};


// This can be improved with an object allowing a bi-directional lookup.
export const getFlywayCliVersionForHash = (hash: string): FlywayVersion => {
    switch (hash) {
        case "8db94751127b6e78d0fbbff36cc599d8": {
            return FlywayVersion["V4.0.0"];
        }

        case "1c6e1c95459a26a6789f4bd42e39ca66": {
            return FlywayVersion["V4.0.1"];
        }

        case "bffbd566cb17f5c8398ececfdb388b45": {
            return FlywayVersion["V4.0.2"];
        }

        case "a925d7b0b85311dc1debf874e73e79f3": {
            return FlywayVersion["V4.0.3"];
        }

        case "a8928601159dc97c3d2f37d5d056fad1": {
            return FlywayVersion["V4.1.0"];
        }

        case "6bd22f2a3f6e115fac362806823d4a02": {
            return FlywayVersion["V4.1.1"];
        }

        case "c04e47ed3181e4c2b90e9ef4b252e90f": {
            return FlywayVersion["V4.1.2"];
        }

        case "2fe2bb1c220c341b96b7065c545fe305": {
            return FlywayVersion["V4.2.0"];
        }

        case "f55eda2f00fa23b60f520b70f998e5e8": {
            return FlywayVersion["V5.0.0"];
        }

        case "58823f5cd747fb3afd3228a843953dd3": {
            return FlywayVersion["V5.0.1"];
        }

        case "3381210473ccfaef0507b0e810a5c50e": {
            return FlywayVersion["V5.0.2"];
        }

        case "76dfe464aa1d81be5c519dfe6e5f89b7": {
            return FlywayVersion["V5.0.3"];
        }

        case "900f3b5534b565853f22ef3c1be72eb6": {
            return FlywayVersion["V5.0.4"];
        }

        case "70c0dd0dc65f93f0cbcb43e8cfe74ccd": {
            return FlywayVersion["V5.0.5"];
        }

        case "4b0cdbcf1d4d6d0e170aa6e823925d69": {
            return FlywayVersion["V5.0.6"];
        }

        case "8672ee8a20ed1d4b7c1adae81f08745d": {
            return FlywayVersion["V5.0.7"];
        }

        case "367981affcf35ee500a22b85fa50359e": {
            return FlywayVersion["V5.1.0"];
        }

        case "7d4b656ea414da226e6ce0598b0948cc": {
            return FlywayVersion["V5.1.1"];
        }

        case "4d60e7f6bf5245adfe763ac7ce070954": {
            return FlywayVersion["V5.1.3"];
        }

        case "de707395274660e70e3f836d46627902": {
            return FlywayVersion["V5.1.4"];
        }

        case "c35fe28db89656b923c15052ba624048": {
            return FlywayVersion["V5.2.0"];
        }

        case "1b29c089834357832bff82acde2f0424": {
            return FlywayVersion["V5.2.1"];
        }

        case "185b6484a2b22dba5db9f7d13e2b10f8": {
            return FlywayVersion["V5.2.2"];
        }

        case "aa29af61b4a7964c8118aa6ef021c5fa": {
            return FlywayVersion["V5.2.3"];
        }

        case "52b579e159608ba5bd4e6f716d3ca547": {
            return FlywayVersion["V5.2.4"];
        }

        case "5ac63a0d854b88603471b0bdbc88a591": {
            return FlywayVersion["V6.0.0"];
        }

        case "342dd653bef20251afb9275c819b73cb": {
            return FlywayVersion["V6.0.1"];
        }

        case "971534dc400d1d925fa90db20795dce3": {
            return FlywayVersion["V6.0.2"];
        }

        case "cac893699cee41fb6249f151aa3bce65": {
            return FlywayVersion["V6.0.3"];
        }

        case "692e18572794f3e46fe861e1107fa657": {
            return FlywayVersion["V6.0.4"];
        }

        case "bcd762722a25c076c7978e48354e22da": {
            return FlywayVersion["V6.0.5"];
        }

        case "50e95e932f7b9f7860f1bbac46fb7e02": {
            return FlywayVersion["V6.0.6"];
        }

        case "65609b2d07d66896ea10f2f9c080e20d": {
            return FlywayVersion["V6.0.7"];
        }

        case "28cfa3ab421ff90cb9d8bd75e47f1349": {
            return FlywayVersion["V6.0.8"];
        }

        case "47f4ce3b17124b7520854eacc742a63a": {
            return FlywayVersion["V6.1.0"];
        }

        case "46e9a31132d6da7a68be3aa3179fdf92": {
            return FlywayVersion["V6.1.1"];
        }

        case "5ccf6ebd575189c2bc66c31ef7b01ae1": {
            return FlywayVersion["V6.1.2"];
        }

        case "d672b05a0bf3ae8919e77ec93b376f77": {
            return FlywayVersion["V6.1.3"];
        }

        case "3083236d96ee2f5def3e63379a876465": {
            return FlywayVersion["V6.1.4"];
        }

        case "409707a6f40873257cf53777a6f741fd": {
            return FlywayVersion["V6.2.0"];
        }

        case "00548c1ffbb800e66ea9561f350bd906": {
            return FlywayVersion["V6.2.1"];
        }

        case "5d0c29138ca3e8cc4916aa1f2a1dbb54": {
            return FlywayVersion["V6.2.2"];
        }

        case "b2da3ea6ccd1212b5c43bc80ec3bc45a": {
            return FlywayVersion["V6.2.3"];
        }

        case "bdd357cbad302a728e0bcbca1cff91c3": {
            return FlywayVersion["V6.2.4"];
        }

        case "27933cb4546bbb6397c8b7ad68d2a403": {
            return FlywayVersion["V6.3.0"];
        }

        case "5fb0bf0fc8df9946ee96cac9fbc78fb8": {
            return FlywayVersion["V6.3.1"];
        }

        case "5407d26dcdf14a6c2716d75a8be9eee8": {
            return FlywayVersion["V6.3.2"];
        }

        case "8c461829e2dfc150c77c53e2ddd6e8c2": {
            return FlywayVersion["V6.3.3"];
        }

        case "93f01edf0792f237deccb92790fef81e": {
            return FlywayVersion["V6.4.0"];
        }

        case "8ece67295e208027fe87e71b890d678b": {
            return FlywayVersion["V6.4.1"];
        }

        case "2602d0d7a0717f0d5a91b4d4f1d86e82": {
            return FlywayVersion["V6.4.2"];
        }

        case "a9f06555245b98cddc3b15de921d0e5c": {
            return FlywayVersion["V6.4.3"];
        }

        case "ff2753f08215923480f4b29efed475a9": {
            return FlywayVersion["V6.4.4"];
        }

        case "4af2b32061539b90cf6fa4ae887a1058": {
            return FlywayVersion["V6.5.0"];
        }

        case "0305c448b56f221769f082de51030b41": {
            return FlywayVersion["V6.5.1"];
        }

        case "e5552dbeae97aa33db78dde710babc41": {
            return FlywayVersion["V6.5.2"];
        }

        case "6ba1a0a446e4bd534d59a150e561ba2a": {
            return FlywayVersion["V6.5.3"];
        }

        case "1d4981a1cc001f92ae020cfada98728b": {
            return FlywayVersion["V6.5.4"];
        }

        case "2478d46a67254d060f116518bbda0ef4": {
            return FlywayVersion["V6.5.5"];
        }

        case "f9a693bf3c3b3f6e61db5df6016f305d": {
            return FlywayVersion["V6.5.6"];
        }

        case "0b2e87c4803d42fdaa4e52166540fb38": {
            return FlywayVersion["V6.5.7"];
        }

        case "bd9e8589c21819a3f4cebf4fbcc41a58": {
            return FlywayVersion["V7.0.0"];
        }

        case "33a0015bf815b8f9038ced742e8c80c4": {
            return FlywayVersion["V7.0.1"];
        }

        case "05a5283f7de5800e20a9afd760f094c4": {
            return FlywayVersion["V7.0.2"];
        }

        case "72e8042a40b6c7d1275ae2d787201bb4": {
            return FlywayVersion["V7.0.3"];
        }

        case "ea977fc0fba6c231a98c1bd91a00fabd": {
            return FlywayVersion["V7.0.4"];
        }

        case "fa3b061517d122aa68762112adf3a107": {
            return FlywayVersion["V7.1.0"];
        }

        case "d923d1eb6e11d3fdeb7c02a3d22c4c23": {
            return FlywayVersion["V7.1.1"];
        }

        case "6c59655ffc0716696803c5ee585584a3": {
            return FlywayVersion["V7.10.0"];
        }

        case "1d5ed44eb6ddcb0842a8c074d53a50d8": {
            return FlywayVersion["V7.11.0"];
        }

        case "b8bcb3b23d04305e21617076e2636251": {
            return FlywayVersion["V7.11.1"];
        }

        case "dfe1b76027c3cc7c9821b0c629928a74": {
            return FlywayVersion["V7.11.2"];
        }

        case "9b26f97dfddbc50028ed5f9700fb480b": {
            return FlywayVersion["V7.11.3"];
        }

        case "7e37b55da136cbacb1e88a0344a7729f": {
            return FlywayVersion["V7.11.4"];
        }

        case "57b3ae7ceb7276dfd63d6e6b033fbccb": {
            return FlywayVersion["V7.12.0"];
        }

        case "8142874fc5bdc0404d070f1bf1b721a3": {
            return FlywayVersion["V7.12.1"];
        }

        case "76bfbd1ff3826a78e3d8cd1707eec6ef": {
            return FlywayVersion["V7.13.0"];
        }

        case "185b338da46d2f2413da1a615764a73b": {
            return FlywayVersion["V7.14.0"];
        }

        case "ef68f61d58379b7b7bfd10aee790a0a4": {
            return FlywayVersion["V7.14.1"];
        }

        case "ad5a615566dac405e85b330ce5f630eb": {
            return FlywayVersion["V7.15.0"];
        }

        case "8d0648bd2286986fc56c7851e617baf0": {
            return FlywayVersion["V7.2.0"];
        }

        case "f8ff99d36afd65055aa3b6e6c0a3bcba": {
            return FlywayVersion["V7.2.1"];
        }

        case "52b860b6c632e19a1b8df3fd59ed0ff7": {
            return FlywayVersion["V7.3.0"];
        }

        case "047dea74610fc6f8226d42d54e6c5a71": {
            return FlywayVersion["V7.3.1"];
        }

        case "3bbb002654658f0f39371b5b4efd8cfb": {
            return FlywayVersion["V7.3.2"];
        }

        case "d50c2884f4f1bcb963a8875139262e49": {
            return FlywayVersion["V7.4.0"];
        }

        case "dc60111cea1bdc8955502c1371f641fd": {
            return FlywayVersion["V7.5.0"];
        }

        case "1cf5b5bffabb3b8d9f74aa8f348e2bad": {
            return FlywayVersion["V7.5.1"];
        }

        case "fa90024552ca0873ccb96b36d6e4453e": {
            return FlywayVersion["V7.5.2"];
        }

        case "2d8607cf7e069660bd32dd6e69faaa19": {
            return FlywayVersion["V7.5.3"];
        }

        case "a0fa3d3dd1cb4b979e18a0c1acd53464": {
            return FlywayVersion["V7.5.4"];
        }

        case "04fb45c3b29d0362791112c3d58d0f25": {
            return FlywayVersion["V7.6.0"];
        }

        case "979761cf163febf9630fe48054532d51": {
            return FlywayVersion["V7.7.0"];
        }

        case "1c3f930a86aa30412f1f161f120ea5aa": {
            return FlywayVersion["V7.7.1"];
        }

        case "a012ca8e62dc4b3a87c87fba23a3576b": {
            return FlywayVersion["V7.7.2"];
        }

        case "5de2d8b32782212fc0e2212f341da17b": {
            return FlywayVersion["V7.7.3"];
        }

        case "f3647f7341c70a2614038ec760c2d7a1": {
            return FlywayVersion["V7.8.0"];
        }

        case "5117002236ac929547c494c7799a2943": {
            return FlywayVersion["V7.8.1"];
        }

        case "d225642b1f4df79dde87178200c91031": {
            return FlywayVersion["V7.8.2"];
        }

        case "2605a54005fbff70deadb7e41fbc2dbe": {
            return FlywayVersion["V7.9.0"];
        }

        case "f9fa3f00b135a77aecb5940c4eba679e": {
            return FlywayVersion["V7.9.1"];
        }

        case "fc66749717e2f248dd587256ccf6a867": {
            return FlywayVersion["V7.9.2"];
        }

        case "46d9b279ee3f328409e088611b9c371a": {
            return FlywayVersion["V8.0.0"];
        }

        case "ef8ac9401fc022336087edf8e3c35e15": {
            return FlywayVersion["V8.0.1"];
        }

        case "997a9fc9ce262da28a11f3a4c16899cc": {
            return FlywayVersion["V8.0.2"];
        }

        case "d2bebfaabc95f0b8f08d765617056033": {
            return FlywayVersion["V8.0.3"];
        }

        case "850b6a1d8a85c57a72e9fa6c52380400": {
            return FlywayVersion["V8.0.4"];
        }

        case "e8ea8c894473e1afe370f95096337b49": {
            return FlywayVersion["V8.0.5"];
        }

        case "590caad7ac346ef27bdec3475ff74ac1": {
            return FlywayVersion["V8.1.0"];
        }

        case "cea56022eb64ffccf9edf3f598259e1c": {
            return FlywayVersion["V8.2.0"];
        }

        case "104da35a42bc8e8815b989ce5246070a": {
            return FlywayVersion["V8.2.1"];
        }

        case "269200398727624a300e53a8cf789741": {
            return FlywayVersion["V8.2.2"];
        }

        case "77cb160b318e2bc178ea5f459b462b74": {
            return FlywayVersion["V8.2.3"];
        }

        case "69aad3a9717e5ed76bc50c5a17536930": {
            return FlywayVersion["V8.3.0"];
        }

        case "e1267c5fde19f25b4e5ec2527b4a105c": {
            return FlywayVersion["V8.4.0"];
        }

        case "77c147b836a77ab605e6f42429dedc25": {
            return FlywayVersion["V8.4.1"];
        }

        case "ba45e5a8e7326dfa636ef5447492f181": {
            return FlywayVersion["V8.4.2"];
        }

        case "5c9e60c251903150a759251af0f86722": {
            return FlywayVersion["V8.4.3"];
        }

        case "3c8e5639291f8278d15c5145690f3904": {
            return FlywayVersion["V8.4.4"];
        }

        case "45d2c79e343630150ae8ee25a432cc87": {
            return FlywayVersion["V8.5.0"];
        }

        case "94fc5349f489dc83009555d9d4a7493c": {
            return FlywayVersion["V8.5.1"];
        }

        case "3db4c150191e461376006bc412bcb3c5": {
            return FlywayVersion["V8.5.10"];
        }

        case "d004167b68121d1336850f8fb39f849a": {
            return FlywayVersion["V8.5.11"];
        }

        case "3ed0bde9adb7f24802017fa5ae9b7855": {
            return FlywayVersion["V8.5.12"];
        }

        case "9c6d2cbe4182ce70fbe6156934a7bb0a": {
            return FlywayVersion["V8.5.13"];
        }

        case "6c535ee06252da4db13919afdc195d6c": {
            return FlywayVersion["V8.5.2"];
        }

        case "eaf529289a6def8eb5724bc686553dae": {
            return FlywayVersion["V8.5.3"];
        }

        case "562def344cdf27d330d350348835b4e8": {
            return FlywayVersion["V8.5.4"];
        }

        case "24561f553996860804f3bd2da1fe6d56": {
            return FlywayVersion["V8.5.5"];
        }

        case "8872b7a7c8440420502364d99bcfc3da": {
            return FlywayVersion["V8.5.6"];
        }

        case "9aa337612a98c61665aa685777e1adcc": {
            return FlywayVersion["V8.5.7"];
        }

        case "7a4a7bdac7d36f45415f708719a4c27a": {
            return FlywayVersion["V8.5.8"];
        }

        case "6f2c827893a057b24c220ccc247ca240": {
            return FlywayVersion["V8.5.9"];
        }

        case "4dad1d6f28b9b6711d7987fbfbb538b8": {
            return FlywayVersion["V9.0.0"];
        }

        default: {
            throw new Error(`Hash: ${hash} not yet added for Flyway version. This means that the Flyway CLI in question cannot be used from the local system.`);
        }
    }

};