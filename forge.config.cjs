module.exports = {
  packagerConfig: {
    asar: true,
    name: 'warm-warehouse-sokoban',
    executableName: 'warm-warehouse-sokoban',
    appBundleId: 'com.wzszdsa.pushbox',
    win32metadata: {
      CompanyName: 'wzszdsa',
      FileDescription: '仓库搬运工 · 推箱子',
      ProductName: '仓库搬运工',
    },
  },
  outDir: 'release/desktop',
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'warm_warehouse_sokoban',
        setupExe: 'warm-warehouse-sokoban-Setup.exe',
        noMsi: true,
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['win32'],
    },
  ],
};
