const categories = ['strength-equipment', 'weights-and-bars', 'conditioning', 'storage', 'accessories', 'home-gym-packages']

// const strengthEquipmentCategories = ['gym-machines-attachments', 'landmine-handles']

const strengthEquipmentCategories = ['gym-machines-attachments', 'landmine-handles', 'parallel-bars', 
'power-cages-racks', 'power-rack-attachments', 'pull-up-bars', 'situp-benches', 'squat-racks-stands', 'weight-benches', 'weightlifting-equipment']

const weightsAndBarsCategories = ['bars', 'bumper-plates', 'dumbells', 'kettlebells', 'medicine-balls', 'sandbags', 
'slam-balls', 'weight-plates', 'weight-sets-kits', 'wearable-weights']

const conditioningCategories = ['battle-ropes', 'boxing-equipment', 'cardio-equipment', 'core-sliders', 'exercise-mats', 
'exercise-steps', 'hula-hoops', 'pilates-yoga', 'plyo-jump-boxes', 'push-up-handles', 'resistance-bands', 'rollers', 'skipping-ropes']

const gymStorageCategories = ['bar-storage', 'dumbell-storage', 'freestanding-gym-storage', 'kettlebell-storage', 'plate-storage',
'rack-mounted-storage', 'wall-mounted-storage']

const accessoriesCategories = ['barbell-pads', 'clothing-apparel', 'gift-vouchers', 'grip-training', 'gym-floor-mats', 'gym-flags',
'gym-interval-timers', 'lifting-straps, wraps-sleeves', 'merchandise', 'spares-replacements', 'tools', 'weightlifting-belts']

const shopByRangeCategory = ['calisthenics', 'climbing', 'commercial-gym-equipment', 'olympic-weightlifting', 'powerlifting', 'strongman']

const offersCategories = ['offers-strength-equipment', 'offers-weights-bars', 'offers-everything-else']

const subCategoriesArray = [strengthEquipmentCategories, weightsAndBarsCategories, conditioningCategories, gymStorageCategories, accessoriesCategories, []]

const subCatObj = {
    'strength-equipment': strengthEquipmentCategories, 
    'weights-and-bars': weightsAndBarsCategories, 
    'conditioning': conditioningCategories, 
    'storage': gymStorageCategories, 
    'accessories': accessoriesCategories, 
}

module.exports = {categories, strengthEquipmentCategories, weightsAndBarsCategories, conditioningCategories, gymStorageCategories, accessoriesCategories, shopByRangeCategory, offersCategories, subCategoriesArray, subCatObj}