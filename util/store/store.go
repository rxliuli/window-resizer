package store

import (
	"window-resizer/util"
	"window-resizer/util/logger"

	"github.com/oklog/ulid/v2"
)

// PresetSize represents a window size preset
type PresetSize struct {
	ID     string `json:"id"`
	Width  int    `json:"width"`
	Height int    `json:"height"`
}

var conf *util.Conf

// StoreAPI provides methods to interact with the store
type StoreAPI struct {
}

// NewStoreAPI creates a new StoreAPI instance
func NewStoreAPI() *StoreAPI {
	return &StoreAPI{}
}

func init() {
	var err error
	conf, err = util.GetConf("window-resizer")
	if err != nil {
		logger.Error("Failed to get conf: %v", err)
	}
}

// GetPresets retrieves all presets from the store
func (s *StoreAPI) GetPresets() ([]PresetSize, error) {
	logger.Info("Getting presets")
	var presets []PresetSize
	err := conf.Get("presets", &presets)
	if err != nil {
		logger.Error("Failed to get presets: %v", err)
		return nil, err
	}
	if presets == nil {
		presets = []PresetSize{
			{
				ID:     ulid.Make().String(),
				Width:  1024,
				Height: 768,
			},
		}
	}
	return presets, nil
}

// SetPresets stores the presets in the store
func (s *StoreAPI) SetPresets(presets []PresetSize) error {
	logger.Info("Setting presets: %v", presets)
	err := conf.Set("presets", presets)
	if err != nil {
		logger.Error("Failed to set presets: %v", err)
		return err
	}
	return nil
}
